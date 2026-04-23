'use client';

/**
 * useServerSideEvents is a React hook for subscribing to Server-Sent Events (SSE) with type-safe event names.
 * It supports custom event listeners, connection state, and custom headers (e.g., Authorization).
 *
 * Example usage:
 *
 * // 1. Define your event names as a union type or enum:
 * type MyEvents = "tick" | "session-count" | "over";
 *
 * // 2. Use the hook in your component:
 * const { getEventData, connectionState } = useServerSideEvents<MyEvents>({
 *   url: "http://localhost:8000/sse",
 *   options: {
 *     headers: { Authorization: "Bearer TOKEN" }
 *   },
 *   events: {
 *     tick: (data) => console.log("Tick:", data),
 *     "session-count": (data) => console.log("Users:", data),
 *     over: () => console.log("Done!")
 *   }
 * });
 *
 * // 3. Access the latest event data:
 * <div>{getEventData("tick")}</div>
 */

import { EventSource, type EventSourceOptions } from 'extended-eventsource';
import { useState, useEffect, useCallback, useRef } from 'react';

// Options for the hook, parameterized by event names
export interface ServerSideEventOptions<TEventNames extends string> {
  url: string; // SSE endpoint URL
  options?: EventSourceOptions; // Custom options (headers, etc.)
  events?: Record<TEventNames, (data: string) => void>; // Event listeners
}

// Internal state for event data, keyed by event name
type EventData<TEventNames extends string> = Partial<Record<TEventNames, string>>;

// Main hook, parameterized by event names for type safety
export function useServerSideEvents<TEventNames extends string>({
  url,
  options,
  events,
}: ServerSideEventOptions<TEventNames>) {
  // Connection state: "CONNECTING" | "OPEN" | "CLOSED"
  const [connectionState, setConnectionState] = useState<'CONNECTING' | 'OPEN' | 'CLOSED'>(
    'CONNECTING'
  );

  // Holds any connection error event
  const [connectionError, setConnectionError] = useState<Event | null>(null);

  // Ref to the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null);

  // Latest data for each event
  const [eventData, setEventData] = useState<EventData<TEventNames>>({});

  // Ref to the latest events object to avoid unnecessary effect triggers
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  // Effect to set up the EventSource and listeners
  useEffect(() => {
    const es = new EventSource(url, options);
    eventSourceRef.current = es;
    setConnectionError(null); // Clear any previous errors on new connection

    es.onopen = () => setConnectionState('OPEN');
    es.onerror = (err: Event) => {
      setConnectionState('CLOSED');
      setConnectionError(err);
    };

    // Register listeners for each event
    const registeredListeners: {
      eventName: string;
      listener: (evt: MessageEvent) => void;
    }[] = [];

    if (eventsRef.current) {
      Object.entries(eventsRef.current).forEach(([eventName, handler]) => {
        const listener = (evt: MessageEvent) => {
          setEventData((prev) => ({
            ...prev,
            [eventName as TEventNames]: evt.data,
          }));
          // Call the user-provided handler
          (handler as (data: string) => void)(evt.data);
        };
        es.addEventListener(eventName, listener);
        registeredListeners.push({ eventName, listener });
      });
    }

    // Cleanup: remove listeners and close connection
    return () => {
      registeredListeners.forEach(({ eventName, listener }) => {
        es.removeEventListener(eventName, listener);
      });
      es.close();
      eventSourceRef.current = null;
    };
  }, [url, options]);

  /**
   * Register a listener for a specific event name at runtime.
   * Returns a cleanup function to remove the listener.
   */
  const addListener = useCallback((eventName: TEventNames, handler: (data: string) => void) => {
    const currentEventSource = eventSourceRef.current;
    if (!currentEventSource) return;

    const listener = (evt: MessageEvent) => {
      setEventData((prev) => ({
        ...prev,
        [eventName]: evt.data,
      }));
      handler(evt.data);
    };

    currentEventSource.addEventListener(eventName, listener);
    return () => currentEventSource.removeEventListener(eventName, listener);
  }, []);

  /**
   * Get the latest data for a specific event.
   * @param eventName - The event name (type-safe)
   */
  const getEventData = useCallback((eventName: TEventNames) => eventData[eventName], [eventData]);

  /**
   * Close the EventSource connection.
   */
  const closeConnection = useCallback(() => eventSourceRef.current?.close(), []);

  return {
    connectionState,
    connectionError,
    addListener,
    getEventData,
    closeConnection,
  };
}

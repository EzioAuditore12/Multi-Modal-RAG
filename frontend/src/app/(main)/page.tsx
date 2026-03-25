import { Fragment } from 'react/jsx-runtime';
import {
  CalendarDaysIcon,
  GiftIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SquareChevronRightIcon,
  VideoIcon,
} from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Chat } from '@/components/chat/chat';
import {
  ChatHeader,
  ChatHeaderAddon,
  ChatHeaderAvatar,
  ChatHeaderButton,
  ChatHeaderMain,
} from '@/components/chat/chat-header';
import {
  ChatToolbar,
  ChatToolbarAddon,
  ChatToolbarButton,
  ChatToolbarTextarea,
} from '@/components/chat/chat-toolbar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { MESSAGES } from '@/data/examples/messages';
import { PrimaryMessage } from '@/components/examples/primary-message';
import { DateItem } from '@/components/examples/date-item';
import { AdditionalMessage } from '@/components/examples/additional-message';

export default function ChatBasicPage() {
  return (
    <Chat className="flex flex-1">
      <ChatHeader className="border-b">
        <ChatHeaderAddon>
          <ChatHeaderAvatar
            src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png"
            alt="@annsmith"
            fallback="AS"
          />
        </ChatHeaderAddon>
        <ChatHeaderMain>
          <span className="font-medium">Ann Smith</span>
          <span className="text-sm font-semibold">AKA</span>
          <span className="grid flex-1">
            <span className="truncate text-sm font-medium">Front-end developer</span>
          </span>
        </ChatHeaderMain>
        <ChatHeaderAddon>
          <InputGroup className="hidden @2xl/chat:flex">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <ChatHeaderButton className="hidden @2xl/chat:inline-flex">
            <PhoneIcon />
          </ChatHeaderButton>
          <ChatHeaderButton className="hidden @2xl/chat:inline-flex">
            <VideoIcon />
          </ChatHeaderButton>
          <ChatHeaderButton>
            <MoreHorizontalIcon />
          </ChatHeaderButton>
        </ChatHeaderAddon>
      </ChatHeader>

      <ChatMessages className="scrollbar-hidden">
        {MESSAGES.map((msg, i, msgs) => {
          // If date changed, show date item
          if (
            new Date(msg.timestamp).toDateString() !==
            new Date(msgs[i + 1]?.timestamp).toDateString()
          ) {
            return (
              <Fragment key={msg.id}>
                <PrimaryMessage
                  avatarSrc={msg.sender.avatarUrl}
                  avatarAlt={msg.sender.username}
                  avatarFallback={msg.sender.name.slice(0, 2)}
                  senderName={msg.sender.name}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
                <DateItem timestamp={msg.timestamp} className="my-4" />
              </Fragment>
            );
          }

          // If next item is same user, show additional
          if (msg.sender.id === msgs[i + 1]?.sender.id) {
            return (
              <AdditionalMessage key={msg.id} content={msg.content} timestamp={msg.timestamp} />
            );
          }
          // Else, show primary
          else {
            return (
              <PrimaryMessage
                className="mt-4"
                key={msg.id}
                avatarSrc={msg.sender.avatarUrl}
                avatarAlt={msg.sender.username}
                avatarFallback={msg.sender.name.slice(0, 2)}
                senderName={msg.sender.name}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            );
          }
        })}
      </ChatMessages>

      <ChatToolbar>
        <ChatToolbarAddon align="inline-start">
          <ChatToolbarButton>
            <PlusIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
        <ChatToolbarTextarea />
        <ChatToolbarAddon align="inline-end">
          <ChatToolbarButton>
            <GiftIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <CalendarDaysIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <SquareChevronRightIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
      </ChatToolbar>
    </Chat>
  );
}

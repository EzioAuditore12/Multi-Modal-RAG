'use client';

import { useState } from 'react';
import { GlobeIcon, MicIcon } from 'lucide-react';

import {
  PromptInput,
  PromptInputHeader,
  type PromptInputProps,
  usePromptInputAttachments,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputButton,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai/prompt-input';
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentsProps,
} from '@/components/ai/attachments';
import { cn } from '@/lib/utils';

function PromptInputAttachmentsDisplay({ variant = 'inline', ...props }: AttachmentsProps) {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant={variant} {...props}>
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

export interface ChatPromptInputProps extends Omit<PromptInputProps, 'onSubmit'> {
  isStreaming: boolean;
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
}

export function ChatPromptInput({
  className,
  globalDrop = true,
  multiple = true,
  onSubmit,
  isStreaming,
  text,
  onTextChange,
  ...props
}: ChatPromptInputProps) {
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

  return (
    <PromptInput
      className={cn(className)}
      globalDrop={globalDrop}
      multiple={multiple}
      onSubmit={onSubmit}
      {...props}>
      <PromptInputHeader>
        <PromptInputAttachmentsDisplay />
      </PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea onChange={(event) => onTextChange(event.target.value)} value={text} />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputButton
            onClick={() => setUseMicrophone(!useMicrophone)}
            variant={useMicrophone ? 'default' : 'ghost'}>
            <MicIcon size={16} />
            <span className="sr-only">Microphone</span>
          </PromptInputButton>
          <PromptInputButton
            onClick={() => setUseWebSearch(!useWebSearch)}
            variant={useWebSearch ? 'default' : 'ghost'}>
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={isStreaming || !text.trim()}
          status={isStreaming ? 'streaming' : 'ready'}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}

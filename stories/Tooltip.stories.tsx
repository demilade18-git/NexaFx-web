import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { InfoIcon } from "../components/ui/info-icon";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";

const meta = {
  title: "UI/Tooltip",
  component: InfoIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a helpful tooltip",
    size: "md",
    side: "top",
  },
};

export const Small: Story = {
  args: {
    content: "Small tooltip",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    content: "Large tooltip with more information",
    size: "lg",
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    size: "md",
    side: "bottom",
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    size: "md",
    side: "left",
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    size: "md",
    side: "right",
  },
};

export const CustomTooltip: StoryObj<typeof Tooltip> = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
            Hover me
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Custom tooltip content
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

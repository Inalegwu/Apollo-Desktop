import { useObservable } from "@legendapp/state/react";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useCallback, useImperativeHandle } from "react";

type Variants = "success" | "error" | "info";

type ToastProps = {
  variant: Variants;
  message: string;
  duration?: number;
};

type NotifierRef = {
  toast: (props: ToastProps) => void;
};

const Notifier = React.forwardRef<NotifierRef>((_, ref) => {
  const isVisible = useObservable(true);
  const duration = useObservable(3000);
  const variant = useObservable<Variants>();
  const message = useObservable("default message");

  useImperativeHandle(ref, () => ({
    toast: (props) => {
      duration.set(props.duration);
      variant.set(props.variant);
      message.set(props.message);
      isVisible.set(true);
    },
  }));

  const hide = useCallback(() => {
    isVisible.set(false);
  }, [isVisible]);

  if (variant.get() === "error") {
    return <></>;
  }

  if (variant.get() === "info") {
    return <></>;
  }

  if (variant.get() === "success") {
    return <></>;
  }

  return (
    <AnimatePresence>
      {isVisible.get() && (
        <motion.div
          initial={{ bottom: 100 }}
          animate={{ bottom: 0 }}
          exit={{ bottom: 100 }}
        >
          <Box className="absolute bottom-3 left-[44%] max-w-sm bg-light-2 dark:bg-dark-8 rounded-md border-1 border-solid border-zinc-200/40 dark:border-zinc-800 px-3 py-2">
            <Flex
              gap="1"
              align="start"
              width="100%"
              height="100%"
              direction="column"
            >
              <Flex width="100%" align="center" justify="end">
                <Button
                  onClick={hide}
                  variant="ghost"
                  className="w-2.5 h-4.5 rounded-full cursor-pointer"
                  color="tomato"
                >
                  <X />
                </Button>
              </Flex>
              <Flex>
                <Text size="2">{message.get()}</Text>
              </Flex>
            </Flex>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default Notifier;

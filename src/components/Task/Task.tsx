import {
  Box,
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiCheckCircle, BiCircle } from "react-icons/bi";
import { useTaskDelete } from "../../hooks/useTaskDelete";
import { useTaskMutation } from "../../hooks/useTaskMutation";

export interface TaskProps {
  data: {
    id: string;
    title: string;
    completed: boolean;
  };
}

export function Task({ data: task }: TaskProps) {
  const theme = useMantineTheme();
  const { mutate, isLoading } = useTaskMutation();
  const [done, setDone] = useState(task.completed);
  const { mutate: remove, isLoading: isDeleting } = useTaskDelete();
  const [showEditModal, setShowEditModal] = useState(false);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      title: task.title,
    },
  });

  return (
    <>
      <Box
        sx={(theme) => ({
          background: theme.colors.gray[1],
          borderRadius: theme.radius.md,
          padding: "1rem",
          marginBottom: ".5rem",
        })}
        key={task.id}
      >
        <Group position="apart" align="center">
          <Text>{task.title}</Text>
          <Group align="center" spacing="xs">
            <Button
              variant="subtle"
              compact
              size="xs"
              color="gray"
              onClick={() => setShowEditModal(true)}
            >
              Editar
            </Button>
            <Button
              variant="subtle"
              compact
              size="xs"
              color="gray"
              onClick={() => remove({ id: task.id })}
              loading={isDeleting}
            >
              Eliminar
            </Button>
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                mutate({ id: task.id, completed: !task.completed });
                setDone((prev) => !prev);
              }}
            >
              {done ? (
                <BiCheckCircle size={24} color={theme.colors.gray[6]} />
              ) : (
                <BiCircle size={24} color={theme.colors.gray[6]} />
              )}
            </Box>
          </Group>
        </Group>
      </Box>
      <Modal
        centered
        title="Edit task"
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <form
          onSubmit={handleSubmit((data) =>
            mutate(
              { id: task.id, title: data.title },
              {
                onSuccess() {
                  setShowEditModal(false);
                },
              }
            )
          )}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => <TextInput {...field} />}
          />

          <Button
            loading={isLoading}
            style={{ float: "right" }}
            mt={16}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Modal>
    </>
  );
}
"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useState } from "react";

interface Props {
  audience:
    | "everyone"
    | "followers"
    | "selected"
    | "closeFriends";

  setAudience: (
    audience:
      | "everyone"
      | "followers"
      | "selected"
      | "closeFriends"
  ) => void;

  location: string;
  setLocation: (value: string) => void;

  collaborators: string[];
  addCollaborator: (username: string) => void;

  selectedUsers?: string[];
  setSelectedUsers?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  darkMode: boolean;
}

export default function PostOptions({
  audience,
  setAudience,
  location,
  setLocation,
  collaborators,
  addCollaborator,
  selectedUsers = [],
  setSelectedUsers,
  darkMode,
}: Props) {
  const [collaboratorInput, setCollaboratorInput] = useState("");
  const [selectedInput, setSelectedInput] = useState("");

  const handleAddCollaborator = () => {
    const username =
      collaboratorInput.trim();

    if (!username) return;

    addCollaborator(username);
    setCollaboratorInput("");
  };

  const handleAddSelectedUser = () => {
    if (!setSelectedUsers) return;

    const username =
      selectedInput.trim();

    if (!username) return;

    setSelectedUsers((prev) => [
      ...prev,
      username,
    ]);

    setSelectedInput("");
  };

  const audienceOptions = [
    {
      value: "everyone",
      label: "Everyone",
      description: "Anyone can view this post",
    },
    {
      value: "followers",
      label: "Followers",
      description: "Only your followers can view",
    },
    {
      value: "closeFriends",
      label: "Close Friends",
      description: "Visible to close friends only",
    },
    {
      value: "selected",
      label: "Selected Users",
      description: "Choose specific users",
    },
  ];

  return (
    <div className={`
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      rounded-3xl
      shadow-sm
      p-5
      space-y-6
    `}>

      {/* Location */}

      <div>
        <label className="block text-sm font-medium mb-2">
          📍 Location
        </label>

        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          placeholder="Add location"
          className={`
            w-full
            border
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
          `}
        />
      </div>

      {/* Audience */}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={`
              w-full
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-2xl
              border
              ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }
            `}
          >
            <span>
              {
                audienceOptions.find(
                  (item) =>
                    item.value === audience
                )?.label
              }
            </span>

            <span>▼</span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="start"
            className={`
              z-50
              min-w-[300px]
              rounded-2xl
              shadow-xl
              border
              overflow-hidden
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {audienceOptions.map(
              (option) => (
                <DropdownMenu.Item
                  key={option.value}
                  onClick={() =>
                    setAudience(
                      option.value as any
                    )
                  }
                  className={`
                    cursor-pointer
                    px-4
                    py-3
                    outline-none
                    ${
                      darkMode
                        ? "text-white focus:bg-white focus:text-black"
                        : "text-gray-800 focus:bg-gray-200"
                    }
                  `}
                >
                  <div className="font-medium">
                    {option.label}
                  </div>

                  <div className="text-xs opacity-70">
                    {
                      option.description
                    }
                  </div>
                </DropdownMenu.Item>
              )
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Selected Users */}

      {audience === "selected" &&
        setSelectedUsers && (
          <div>
            <label className="block text-sm font-medium mb-2">
              🔒 Allowed Users
            </label>

            <div className="flex gap-2">
              <input
                value={selectedInput}
                onChange={(e) =>
                  setSelectedInput(
                    e.target.value
                  )
                }
                placeholder="username"
                className={`
                  flex-1
                  border
                  rounded-2xl
                  px-4
                  py-3
                  ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
                `}
              />

              <button
                type="button"
                onClick={
                  handleAddSelectedUser
                }
                className="
                  px-4
                  rounded-2xl
                  bg-black
                  text-white
                "
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedUsers.map(
                (user) => (
                  <span
                    key={user}
                    className={`
                      px-3
                      py-1
                      ${darkMode ? 'bg-gray-600' : 'bg-zinc-100'}
                      rounded-full
                      text-sm
                    `}
                  >
                    @{user}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {/* Collaborators */}

      <div>
        <label className="block text-sm font-medium mb-2">
          🤝 Collaborators
        </label>

        <div className="flex gap-2">
          <input
            value={collaboratorInput}
            onChange={(e) =>
              setCollaboratorInput(
                e.target.value
              )
            }
            placeholder="username"
            className={`
              flex-1
              border
              rounded-2xl
              px-4
              py-3
              ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
            `}
          />

          <button
            type="button"
            onClick={
              handleAddCollaborator
            }
            className={`
              px-4
              rounded-2xl
              bg-gray-800
              transition
              duration-300
              ${darkMode ? 'hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-500'}
              text-white
            `}
          >
            Add
          </button>
        </div>

        {collaborators.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {collaborators.map(
              (user) => (
                <span
                  key={user}
                  className={`
                    px-3
                    py-1
                    ${darkMode ? 'bg-gray-600' : 'bg-zinc-100'}
                    rounded-full
                    text-sm
                  `}
                >
                  @{user}
                </span>
              )
            )}
          </div>
        )}
      </div>

    </div>
  );
}
'use client';
import React from 'react';
import { useDisclosure } from '@heroui/react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { LuBuilding2 } from 'react-icons/lu';
import { BiUser } from 'react-icons/bi';
import CreateCompanyModal from './CreateWorkspaceModal';
import JoinCompanyModal from './JoinWorkspaceModal';

export default function WorkspaceEntry() {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateChange,
  } = useDisclosure();
  const {
    isOpen: isJoinOpen,
    onOpen: onJoinOpen,
    onOpenChange: onJoinChange,
  } = useDisclosure();

  return (
    <div className="flex items-center justify-center min-h-full md:w-1/2 bg-linear-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shadow-xl border border-gray-200">
        <CardBody className="flex flex-col items-center text-center gap-6 p-6 sm:p-8 md:p-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100">
            <LuBuilding2 className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Welcome to FixFlow
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Create a workspace or join an existing one to start managing
              tasks, workers, and schedules.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full ">
            <Button
              onPress={onCreateOpen}
              className="sm:flex-1"
              color="primary"
              startContent={<LuBuilding2 size={18} />}
            >
              Create Workspace
            </Button>

            <Button
              onPress={onJoinOpen}
              className="sm:flex-1"
              variant="bordered"
              startContent={<BiUser size={18} />}
            >
              Join Workspace
            </Button>
          </div>
        </CardBody>
      </Card>
      <CreateCompanyModal isOpen={isCreateOpen} onOpenChange={onCreateChange} />
      <JoinCompanyModal isOpen={isJoinOpen} onOpenChange={onJoinChange} />
    </div>
  );
}

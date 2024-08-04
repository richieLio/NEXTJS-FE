import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
        <div className="flex justify-center items-center h-screen w-screen">
          <Spinner label="Loading..." color="success" />
        </div>
  );
}

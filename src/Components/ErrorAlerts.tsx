import { XMarkIcon } from "@heroicons/react/24/solid";
import { useHomeStore } from "~/state";
import type { ErrorAlert } from "~/types";

const SingleAlert = ({ error }: { error: ErrorAlert }) => {
  const clearError = useHomeStore((state) => state.clearErrorAlert);
  return (
    <div
      className="relative my-1 flex rounded border border-red-400 bg-red-100 px-2 py-1 align-middle text-red-700"
      role="alert"
    >
      <div className="flex items-center text-sm">
        <span>{error.message}</span>
      </div>
      <div className="bottom-0 right-0 top-0 flex  px-1 py-1 align-middle">
        <XMarkIcon
          width={20}
          title="Close"
          role="button"
          onClick={() => clearError(error.id)}
        />
      </div>
    </div>
  );
};

export default function ErrorAlerts() {
  const errors = useHomeStore((state) => state.errorAlerts);
  return (
    <div className="fixed bottom-0 right-0 m-1">
      {errors.map((error) => (
        <SingleAlert error={error} key={error.id} />
      ))}
    </div>
  );
}

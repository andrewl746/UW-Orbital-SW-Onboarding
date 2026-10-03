import { useState } from "react";
import type { FormEvent } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../components/Table";
import type { CommandHistory } from "../utils/types";
import { useCommandHistory } from "../hooks/useCommandHistory";

const columnHelper = createColumnHelper<CommandHistory>();

const columns = [
  columnHelper.accessor("created_at", {
    header: "Timestamp",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor("status", { header: "Status" }),
  columnHelper.accessor("params", {
    header: "Parameters",
    cell: (info) => info.getValue() ?? "—",
  }),
  columnHelper.accessor("command_id", { header: "Command ID" }),
];

/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  const [input, setInput] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const { data, isLoading, isError } = useCommandHistory(submittedId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // stops the browser from reloading the page on submit
    setSubmittedId(input.trim());
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          Command Audit Log
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every change to a command, newest first. Deleted commands keep their
          history.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-5xl gap-4">
        <input
          type="text"
          placeholder="Paste a command ID…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-input text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-ring"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          View history
        </button>
      </form>

      {submittedId === "" && (
        <p className="text-muted-foreground">
          Enter a command ID to view its history.
        </p>
      )}
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-destructive">No history found for that command.</p>
      )}

      <Table data={data ?? []} columns={columns} showFilters={false} />
    </div>
  );
}

export default CommandHistoryPage;

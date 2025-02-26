"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AdminSideBar from "../../_components/AdminSideBar"
import AdminNavBar from "../../_components/AdminNavBar"
import Container from "@/app/components/Container"

const data = [
  {
    regNumber: "JAMB202501",
    name: "John Doe",
    english: 75,
    math: 85,
    chemistry: 80,
    physics: 90,
    total: 330,
  },
  {
    regNumber: "JAMB202502",
    name: "Jane Smith",
    english: 65,
    math: 70,
    chemistry: 75,
    physics: 80,
    total: 290,
  },
  {
    regNumber: "JAMB202503",
    name: "Samuel Brown",
    english: 80,
    math: 95,
    chemistry: 85,
    physics: 88,
    total: 348,
  },
]

const columns = [
  {
    accessorKey: "regNumber",
    header: "Reg Number",
    cell: ({ row }) => <div>{row.getValue("regNumber")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "english",
    header: "English",
    cell: ({ row }) => <div>{row.getValue("english")}</div>,
  },
  {
    accessorKey: "math",
    header: "Math",
    cell: ({ row }) => <div>{row.getValue("math")}</div>,
  },
  {
    accessorKey: "chemistry",
    header: "Chemistry",
    cell: ({ row }) => <div>{row.getValue("chemistry")}</div>,
  },
  {
    accessorKey: "physics",
    header: "Physics",
    cell: ({ row }) => <div>{row.getValue("physics")}</div>,
  },
  {
    accessorKey: "total",
    header: "Total Score",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("total")}</div>,
  },
]

const ExamDataTable = () => {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex md:pl-8 min-h-screen">
      <AdminSideBar />
      <div className="flex flex-col w-full">
        <AdminNavBar />
        <h1 className="text-2xl font-bold mt-8 px-10">Score Sheet</h1>
        <div className="px-10 pb-3 mt-10 md:pb-8 w-full flex justify-center items-start">
          <Container>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="text-base">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-base">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}

export default ExamDataTable

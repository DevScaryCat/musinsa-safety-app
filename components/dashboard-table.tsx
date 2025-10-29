"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
// [수정] issue-card에서 정의한 상세한 Issue 타입을 import
import { Issue } from "@/components/issue-card"

// [수정] Prop 타입 변경 및 onRowClick 추가
interface IssueDataTableProps {
    data: Issue[]
    onRowClick: (issue: Issue) => void
}

export function IssueDataTable({ data, onRowClick }: IssueDataTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>점검일</TableHead>
                    <TableHead>센터/층수</TableHead>
                    <TableHead>세부 위치</TableHead>
                    <TableHead>요인</TableHead>
                    <TableHead>재해 유형</TableHead>
                    <TableHead>개선 상태</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((issue) => (
                    // [수정] 행(Row)에 onClick 이벤트 및 스타일 추가
                    <TableRow
                        key={issue.id}
                        onClick={() => onRowClick(issue)}
                        className="cursor-pointer hover:bg-muted/50"
                    >
                        <TableCell>{issue.date}</TableCell>
                        <TableCell>{issue.location}</TableCell>
                        <TableCell>{issue.area}</TableCell>
                        <TableCell>{issue.factor}</TableCell>
                        <TableCell>{issue.hazard}</TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === "pending"
                                        ? "bg-red-100 text-red-800"
                                        : issue.status === "inprogress"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                    }`}
                            >
                                {issue.status === "pending"
                                    ? "개선 필요"
                                    : issue.status === "inprogress"
                                        ? "개선 중"
                                        : "개선 완료"}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
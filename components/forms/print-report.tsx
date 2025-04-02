"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface PrintReportProps {
  reportData: any
  reportType: string
  reportPeriod: string
}

export function PrintReport({ reportData, reportType, reportPeriod }: PrintReportProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)

    // In a real application, you would generate a proper PDF
    // For now, we'll just use the browser's print functionality
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 500)
  }

  const handleDownload = () => {
    // In a real application, you would generate a proper PDF or Excel file
    // For now, we'll just create a JSON file
    try {
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `${reportType.toLowerCase()}-report-${format(new Date(), "yyyy-MM-dd")}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
        <Printer className="mr-2 h-4 w-4" />
        {isPrinting ? "Preparing..." : "Print Report"}
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="outline">
        <FileText className="mr-2 h-4 w-4" />
        Save to Files
      </Button>
    </div>
  )
}


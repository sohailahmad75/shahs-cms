
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {getReportById} from "../../services/dailyReports.ts";

interface Report {
  id: string;
  date: string;
  location: string;
  totalSales: number;
  staffHours: number;
  notes: string;
}

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReportById(id!);
        setReport(data);
      } catch (err) {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Report for {report?.date}</h2>
      <p><strong>Location:</strong> {report?.location}</p>
      <p><strong>Total Sales:</strong> ${report?.totalSales.toFixed(2)}</p>
      <p><strong>Staff Hours:</strong> {report?.staffHours} hrs</p>
      <p><strong>Notes:</strong> {report?.notes || 'N/A'}</p>
    </div>
  );
}

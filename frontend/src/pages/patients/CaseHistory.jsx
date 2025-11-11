import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain, Download } from 'lucide-react';
import { downloadCaseHistoryPdf, getMyCaseHistory } from '@/api/pateint';
import { toast } from 'sonner';

const CaseHistoryWithAISummary = () => {
  const [caseHistories, setCaseHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchCaseHistories = async () => {
      try {
        setLoading(true);
        const res = await getMyCaseHistory();

        if (res?.histories) {
          setCaseHistories(res.histories);
        }
      } catch (err) {
        console.error('Error fetching case history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseHistories();
  }, []);

  const openSummary = (record) => setSelectedCase(record);
  const closeSummary = () => setSelectedCase(null);

  const handleDownloadPdf = async (historyId) => {
    try {
      const response = await downloadCaseHistoryPdf(historyId);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `case_history_${historyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download PDF error:', error);
      toast.error(error.message || 'Failed to download PDF.');
    }
  };

  return (
    <>
      <div className='rounded-2xl overflow-hidden border border-emerald-500/10 bg-[#0b0f0e]/90 shadow-[0_0_12px_rgba(16,185,129,0.05)]'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left border-collapse'>
            <thead>
              <tr className='bg-[#0d1311] text-emerald-400 uppercase tracking-wide text-xs'>
                <th className='py-3 px-4 font-medium'>Date</th>
                <th className='py-3 px-4 font-medium'>Doctor</th>
                <th className='py-3 px-4 font-medium'>Diagnosis</th>
                <th className='py-3 px-4 font-medium'>Prescription</th>
                <th className='py-3 px-4 font-medium'>Follow-Up</th>
                <th className='py-3 px-4 font-medium text-center'>
                  AI Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='text-center py-6 text-gray-400'
                  >
                    Loading case histories...
                  </td>
                </tr>
              ) : caseHistories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='text-center py-6 text-gray-400'
                  >
                    No case histories found.
                  </td>
                </tr>
              ) : (
                caseHistories.map((r) => (
                  <tr
                    key={r._id}
                    className='border-t border-emerald-500/5 hover:bg-[#101614] transition-colors'
                  >
                    <td className='py-3 px-4 text-gray-300'>
                      {r.appointment?.date || '-'}
                    </td>
                    <td className='py-3 px-4 text-gray-300 capitalize'>
                      {r.doctor?.name || r.doctorName || 'Unknown'}
                    </td>
                    <td className='py-3 px-4 text-gray-400 max-w-xs truncate'>
                      {r.diagnosis || '-'}
                    </td>
                    <td className='py-3 px-4 text-gray-400'>
                      {r.prescription || '-'}
                    </td>
                    <td className='py-3 px-4 text-gray-300'>
                      {r.followUp || '-'}
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <Button
                        onClick={() => openSummary(r)}
                        variant='outline'
                        className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 text-xs font-medium rounded-lg'
                      >
                        <Brain
                          size={14}
                          className='mr-1'
                        />{' '}
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!selectedCase}
        onOpenChange={closeSummary}
      >
        <DialogContent className='bg-[#101614] border border-emerald-500/10 text-gray-200 sm:max-w-lg rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-emerald-400'>
                <Brain size={18} /> AI Case Summary
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedCase && (
            <div className='space-y-5 mt-4'>
              <div className='bg-[#0b0f0e]/80 border border-emerald-500/10 rounded-xl p-4 space-y-2'>
                <p>
                  <span className='text-gray-400'>Doctor:</span>{' '}
                  {selectedCase.doctor?.name || selectedCase.doctorName || '-'}
                </p>
                <p>
                  <span className='text-gray-400'>Date:</span>{' '}
                  {selectedCase.appointment?.date || '-'}
                </p>
                <p>
                  <span className='text-gray-400'>Diagnosis:</span>{' '}
                  {selectedCase.diagnosis || '-'}
                </p>
                <p>
                  <span className='text-gray-400'>Prescription:</span>{' '}
                  {selectedCase.prescription || '-'}
                </p>
                <p>
                  <span className='text-gray-400'>Follow-Up:</span>{' '}
                  {selectedCase.followUp || '-'}
                </p>
              </div>

              <div className='bg-[#0b0f0e]/80 border border-emerald-500/10 rounded-xl p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-[#0b0f0e]/20'>
                <h3 className='font-medium text-emerald-400 mb-1'>
                  AI Health Summary
                </h3>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  {selectedCase?.aiSummary}
                </p>
              </div>

              <div className='flex justify-end'>
                <Button
                  onClick={() => handleDownloadPdf(selectedCase._id)}
                  className='bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 rounded-xl flex items-center gap-2'
                >
                  <Download size={16} /> Download Case PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaseHistoryWithAISummary;

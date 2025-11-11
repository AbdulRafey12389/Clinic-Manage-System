import CaseHistory from "../../models/caseHistory.js";
import PDFDocument from "pdfkit";

export const downloadCaseHistoryPdf = async (req, res) => {
  try {
    const { historyId } = req.params;
    const patientId = req.user._id;

    if (!historyId) {
      return res.status(400).json({ message: "History ID is required" });
    }

    const history = await CaseHistory.findOne({
      _id: historyId,
      patient: patientId,
    })
      .populate("doctor", "name specialization experience degrees bio")
      .populate("appointment", "date timeSlot status");

    if (!history) {
      return res.status(404).json({ message: "Case history not found" });
    }

    const doctor = history.doctor || {};
    const appointmentDate = history.appointment?.date
      ? new Date(history.appointment.date).toLocaleDateString()
      : "N/A";
    const timeSlot = history.appointment?.timeSlot || "N/A";
    const aiSummary =
      history.aiSummary || history.aiSuggestion || "No AI summary available";

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=case_history_${history._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc
      .fontSize(30)
      .fillColor("#000000")
      .text("Patient Case History", {
        align: "center",
      })
      .moveDown();

    doc.fontSize(12).fillColor("#000");
    doc.text(`Patient ID: ${history.patient}`).moveDown(0.3);
    doc.text(`Appointment Date: ${appointmentDate}`).moveDown(0.3);
    doc.text(`Time Slot: ${timeSlot}`).moveDown();

    doc
      .fontSize(14)
      .fillColor("#000000")
      .text("Doctor Details", {
        underline: true,
      })
      .moveDown(0.3);
    doc.fontSize(12).fillColor("#000");
    doc.text(`Name: ${history.doctorName.toLocaleUpperCase() || "N/A"}`);
    doc.text(`Specialization: ${doctor.specialization || "N/A"}`);
    doc.text(`Experience: ${doctor.experience || "N/A"}`);
    doc.text(`Degrees: ${doctor.degrees || "N/A"}`);
    doc.text(`Bio: ${doctor.bio || "N/A"}`).moveDown();

    doc
      .fontSize(14)
      .fillColor("#000000")
      .text("Diagnosis", {
        underline: true,
      })
      .moveDown(0.3);
    doc.fontSize(12).fillColor("#000");
    doc.text(history.diagnosis || "No diagnosis available").moveDown();
    doc
      .fontSize(14)
      .fillColor("#000000")
      .text("AI Health Summary", {
        underline: true,
      })
      .moveDown(0.3);
    doc.fontSize(12).fillColor("#000");
    doc.text(aiSummary).moveDown();

    doc
      .moveDown()
      .fontSize(10)
      .fillColor("gray")
      .text("Generated automatically by Clinic Management System", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate PDF",
        error: error.message,
      });
    }
  }
};

import { QuizReportService } from '../service/quizReport.service.js';
const { getQuizReportByIdService, getQuizReportsService, createQuizReportService, updateQuizReportService, deleteQuizReportService } = new QuizReportService
const getQuizReports = async (req, res) => {
  try {
    const quizReports = await getQuizReportsService();
    res.status(200).json(quizReports);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getQuizReportById = async (req, res) => {
  try {
    const quizReport = await getQuizReportByIdService(req.params.id);
    if (!quizReport) {
      return res.status(404).json({ error: 'Quiz Report not found' });
    }
    res.status(200).json(quizReport);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createQuizReport = async (req, res) => {
  try {
    const quizReport = await createQuizReportService(req.body);
    res.status(201).json(quizReport);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

const updateQuizReport = async (req, res) => {
  try {
    const quizReport = await updateQuizReportService(req.params.id, req.body);
    if (!quizReport) {
      return res.status(404).json({ error: 'Quiz Report not found' });
    }
    res.status(200).json(quizReport);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

const deleteQuizReport = async (req, res) => {
  try {
    const quizReport = await deleteQuizReportService(req.params.id);
    if (!quizReport) {
      return res.status(404).json({ error: 'Quiz Report not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getQuizReports,
  getQuizReportById,
  createQuizReport,
  updateQuizReport,
  deleteQuizReport,
};
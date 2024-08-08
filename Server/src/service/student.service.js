import { sendMessage } from '../helpers/sendMessage.js';
import { StudentModel } from '../models/studentModel.js';

class studentService {

    createStudentService = async (req) => {
        const newStudent = new StudentModel(req.body);
        const savedStudent = await newStudent.save();
        if (savedStudent) {
            return sendMessage(true, "Student saved successfully", savedStudent);
        } else {
            return sendMessage(false, "Student not saved", savedStudent);
        }
    }

    getStudentService = async (req) => {
        const { studentId } = req.params;
        const student = await StudentModel.findById(studentId).lean();
        if (student) {
            return sendMessage(true, "Student fetched successfully", student);
        } else {
            return sendMessage(false, "Student not found", student);
        }
    }

    getStudentsService = async (req) => {
        const { limit = 10, pageNo = 1, search = "", orderby, sortByField } = req.query;

        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { course: { $regex: search, $options: 'i' } },
                { batch: { $regex: search, $options: 'i' } },
                { instructor: { $regex: search, $options: 'i' } }
            ];
        }

        const sort = {};
        sort[sortByField] = orderby === "asc" ? 1 : -1;

        const students = await StudentModel.find(query).limit(limit).skip(parseInt(limit) * (pageNo - 1)).sort(sort).lean();
        if (students) {
            return sendMessage(true, "Students fetched successfully", students);
        } else {
            return sendMessage(false, "Students not found", students);
        }
    }

    updateStudentService = async (req) => {
        const { studentId } = req.params;
        const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, req.body, { new: true, runValidators: true });
        if (updatedStudent) {
            return sendMessage(true, "Student updated successfully", updatedStudent);
        } else {
            return sendMessage(false, "Student not updated", updatedStudent);
        }
    }

    deleteStudentService = async (req) => {
        const { studentId } = req.params;
        const deletedStudent = await StudentModel.findByIdAndDelete(studentId);
        if (deletedStudent) {
            return sendMessage(true, "Student deleted successfully", deletedStudent);
        } else {
            return sendMessage(false, "Student not deleted", deletedStudent);
        }
    }
}

export { studentService };

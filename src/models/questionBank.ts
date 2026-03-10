import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface Subject {
    subjectCode: string;
    subjectName: string;
    credits: number;
}

export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface Question {
    questionId: string;
    subject: string; // subjectCode
    questionContent: string;
    difficultyLevel: DifficultyLevel;
    knowledgeCategory: string; // category id
}

export interface ExamTemplateRequirement {
    categoryId: string;
    difficulty: DifficultyLevel;
    count: number;
}

export interface ExamTemplate {
    id: string;
    name: string;
    subjectCode: string;
    requirements: ExamTemplateRequirement[];
}

export interface Exam {
    id: string;
    templateId: string;
    name: string;
    questions: Question[];
    generatedAt: string;
}

const STORAGE_KEYS = {
    CATEGORIES: 'APP_QB_CATEGORIES',
    SUBJECTS: 'APP_QB_SUBJECTS',
    QUESTIONS: 'APP_QB_QUESTIONS',
    TEMPLATES: 'APP_QB_TEMPLATES',
    EXAMS: 'APP_QB_EXAMS',
};

// Seed Data
const seedCategories: Category[] = [
    { id: 'cat_tq', name: 'Tổng quan', description: 'Kiến thức chung cơ bản' },
    { id: 'cat_cs', name: 'Chuyên sâu', description: 'Kiến thức chuyên ngành sâu' },
];
const seedSubjects: Subject[] = [
    { subjectCode: 'CSDL01', subjectName: 'Cơ sở dữ liệu', credits: 3 },
    { subjectCode: 'LTW02', subjectName: 'Lập trình Web', credits: 3 },
];

export default () => {
    const [categories, setCategories] = useState<Category[]>(() => getLocalStorage(STORAGE_KEYS.CATEGORIES, seedCategories));
    const [subjects, setSubjects] = useState<Subject[]>(() => getLocalStorage(STORAGE_KEYS.SUBJECTS, seedSubjects));
    const [questions, setQuestions] = useState<Question[]>(() => getLocalStorage(STORAGE_KEYS.QUESTIONS, []));
    const [templates, setTemplates] = useState<ExamTemplate[]>(() => getLocalStorage(STORAGE_KEYS.TEMPLATES, []));
    const [exams, setExams] = useState<Exam[]>(() => getLocalStorage(STORAGE_KEYS.EXAMS, []));

    useEffect(() => { setLocalStorage(STORAGE_KEYS.CATEGORIES, categories); }, [categories]);
    useEffect(() => { setLocalStorage(STORAGE_KEYS.SUBJECTS, subjects); }, [subjects]);
    useEffect(() => { setLocalStorage(STORAGE_KEYS.QUESTIONS, questions); }, [questions]);
    useEffect(() => { setLocalStorage(STORAGE_KEYS.TEMPLATES, templates); }, [templates]);
    useEffect(() => { setLocalStorage(STORAGE_KEYS.EXAMS, exams); }, [exams]);

    // Generators for random IDs
    const genId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

    // --- CRUD Categories ---
    const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
        setCategories(prev => [...prev, { ...cat, id: genId('cat') }]);
    }, []);
    const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);
    const deleteCategory = useCallback((id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    }, []);

    // --- CRUD Subjects ---
    const addSubject = useCallback((sub: Subject) => { // Subject code provided by user
        setSubjects(prev => [...prev, sub]);
    }, []);
    const updateSubject = useCallback((code: string, updates: Partial<Subject>) => {
        setSubjects(prev => prev.map(s => s.subjectCode === code ? { ...s, ...updates } : s));
    }, []);
    const deleteSubject = useCallback((code: string) => {
        setSubjects(prev => prev.filter(s => s.subjectCode !== code));
    }, []);

    // --- CRUD Questions ---
    const addQuestion = useCallback((q: Omit<Question, 'questionId'>) => {
        setQuestions(prev => [...prev, { ...q, questionId: genId('q') }]);
    }, []);
    const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
        setQuestions(prev => prev.map(q => q.questionId === id ? { ...q, ...updates } : q));
    }, []);
    const deleteQuestion = useCallback((id: string) => {
        setQuestions(prev => prev.filter(q => q.questionId !== id));
    }, []);

    // --- CRUD Templates ---
    const addTemplate = useCallback((tpl: Omit<ExamTemplate, 'id'>) => {
        setTemplates(prev => [...prev, { ...tpl, id: genId('tpl') }]);
    }, []);
    const deleteTemplate = useCallback((id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    }, []);

    // --- Exam Generation ---
    // Returns true if success, false or string error if failure
    const generateExam = useCallback((templateId: string, examName: string): { success: boolean, error?: string, examId?: string } => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return { success: false, error: 'Không tìm thấy cấu trúc đề thi!' };

        const selectedQuestions: Question[] = [];

        for (const req of template.requirements) {
            // Find matching questions
            const matching = questions.filter(q =>
                q.subject === template.subjectCode &&
                q.knowledgeCategory === req.categoryId &&
                q.difficultyLevel === req.difficulty
            );

            // Shuffle and pick
            if (matching.length < req.count) {
                return { success: false, error: `Không đủ câu hỏi. Yêu cầu ${req.count} câu [${req.difficulty}] thuộc danh mục [${categories.find(c => c.id === req.categoryId)?.name}], nhưng chỉ có ${matching.length}.` };
            }

            const shuffled = [...matching].sort(() => 0.5 - Math.random());
            selectedQuestions.push(...shuffled.slice(0, req.count));
        }

        const newExam: Exam = {
            id: genId('exam'),
            templateId,
            name: examName,
            questions: selectedQuestions,
            generatedAt: new Date().toISOString(),
        };

        setExams(prev => [newExam, ...prev]);
        return { success: true, examId: newExam.id };
    }, [templates, questions, categories]);

    const deleteExam = useCallback((id: string) => {
        setExams(prev => prev.filter(e => e.id !== id));
    }, []);

    return {
        categories, addCategory, updateCategory, deleteCategory,
        subjects, addSubject, updateSubject, deleteSubject,
        questions, addQuestion, updateQuestion, deleteQuestion,
        templates, addTemplate, deleteTemplate,
        exams, generateExam, deleteExam
    };
}

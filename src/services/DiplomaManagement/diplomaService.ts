import { DiplomaManagement } from './typing';

const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

const STORAGE_KEYS = {
	REGISTRIES: 'diploma_registries',
	DECISIONS: 'diploma_decisions',
	TEMPLATES: 'diploma_templates',
	DIPLOMAS: 'diploma_records',
};

const getFromStorage = <T>(key: string): T[] => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const diplomaService = {
	// Registry Management
	getRegistries: (): DiplomaManagement.Registry[] => getFromStorage(STORAGE_KEYS.REGISTRIES),
	addRegistry: (data: Omit<DiplomaManagement.Registry, 'id' | 'currentRunningNumber'>) => {
		const registries = getFromStorage<DiplomaManagement.Registry>(STORAGE_KEYS.REGISTRIES);
		const newRegistry: DiplomaManagement.Registry = {
			...data,
			id: uuidv4(),
			currentRunningNumber: 0,
		} as DiplomaManagement.Registry;
		saveToStorage(STORAGE_KEYS.REGISTRIES, [...registries, newRegistry]);
		return newRegistry;
	},

	// Graduation Decision Management
	getDecisions: (): DiplomaManagement.GraduationDecision[] => getFromStorage(STORAGE_KEYS.DECISIONS),
	addDecision: (data: Omit<DiplomaManagement.GraduationDecision, 'id' | 'viewCount'>) => {
		const decisions = getFromStorage<DiplomaManagement.GraduationDecision>(STORAGE_KEYS.DECISIONS);
		const newDecision: DiplomaManagement.GraduationDecision = {
			...data,
			id: uuidv4(),
			viewCount: 0,
		} as DiplomaManagement.GraduationDecision;
		saveToStorage(STORAGE_KEYS.DECISIONS, [...decisions, newDecision]);
		return newDecision;
	},
	updateDecision: (id: string, data: Partial<DiplomaManagement.GraduationDecision>) => {
		const decisions = getFromStorage<DiplomaManagement.GraduationDecision>(STORAGE_KEYS.DECISIONS);
		const index = decisions.findIndex((d) => d.id === id);
		if (index !== -1) {
			decisions[index] = { ...decisions[index], ...data };
			saveToStorage(STORAGE_KEYS.DECISIONS, decisions);
		}
	},
	deleteDecision: (id: string) => {
		const decisions = getFromStorage<DiplomaManagement.GraduationDecision>(STORAGE_KEYS.DECISIONS);
		saveToStorage(STORAGE_KEYS.DECISIONS, decisions.filter((d) => d.id !== id));
	},
	incrementDecisionView: (id: string) => {
		const decisions = getFromStorage<DiplomaManagement.GraduationDecision>(STORAGE_KEYS.DECISIONS);
		const index = decisions.findIndex((d) => d.id === id);
		if (index !== -1) {
			decisions[index].viewCount += 1;
			saveToStorage(STORAGE_KEYS.DECISIONS, decisions);
		}
	},

	// Template Configuration
	getTemplates: (): DiplomaManagement.TemplateField[] => getFromStorage(STORAGE_KEYS.TEMPLATES),
	addTemplate: (data: Omit<DiplomaManagement.TemplateField, 'id'>) => {
		const templates = getFromStorage<DiplomaManagement.TemplateField>(STORAGE_KEYS.TEMPLATES);
		const newField: DiplomaManagement.TemplateField = {
			...data,
			id: uuidv4(),
		} as DiplomaManagement.TemplateField;
		saveToStorage(STORAGE_KEYS.TEMPLATES, [...templates, newField]);
		return newField;
	},
	deleteTemplate: (id: string) => {
		const templates = getFromStorage<DiplomaManagement.TemplateField>(STORAGE_KEYS.TEMPLATES);
		saveToStorage(STORAGE_KEYS.TEMPLATES, templates.filter((t) => t.id !== id));
	},

	// Diploma Information
	getDiplomas: (decisionId?: string): DiplomaManagement.DiplomaRecord[] => {
		const diplomas = getFromStorage<DiplomaManagement.DiplomaRecord>(STORAGE_KEYS.DIPLOMAS);
		return decisionId ? diplomas.filter((d) => d.decisionId === decisionId) : diplomas;
	},
	addDiploma: (data: Omit<DiplomaManagement.DiplomaRecord, 'id' | 'registryNumber'>) => {
		const registries = getFromStorage<DiplomaManagement.Registry>(STORAGE_KEYS.REGISTRIES);
		const decisions = getFromStorage<DiplomaManagement.GraduationDecision>(STORAGE_KEYS.DECISIONS);
		const decision = decisions.find((d) => d.id === data.decisionId);
		if (!decision) throw new Error('Decision not found');

		const registryIndex = registries.findIndex((r) => r.id === decision.registryId);
		if (registryIndex === -1) throw new Error('Registry not found');

		const newRunningNumber = registries[registryIndex].currentRunningNumber + 1;
		registries[registryIndex].currentRunningNumber = newRunningNumber;
		saveToStorage(STORAGE_KEYS.REGISTRIES, registries);

		const diplomas = getFromStorage<DiplomaManagement.DiplomaRecord>(STORAGE_KEYS.DIPLOMAS);
		const newDiploma: DiplomaManagement.DiplomaRecord = {
			...data,
			id: uuidv4(),
			registryNumber: newRunningNumber,
		} as DiplomaManagement.DiplomaRecord;
		saveToStorage(STORAGE_KEYS.DIPLOMAS, [...diplomas, newDiploma]);
		return newDiploma;
	},
	updateDiploma: (id: string, data: Partial<Omit<DiplomaManagement.DiplomaRecord, 'registryNumber'>>) => {
		const diplomas = getFromStorage<DiplomaManagement.DiplomaRecord>(STORAGE_KEYS.DIPLOMAS);
		const index = diplomas.findIndex((d) => d.id === id);
		if (index !== -1) {
			diplomas[index] = { ...diplomas[index], ...data };
			saveToStorage(STORAGE_KEYS.DIPLOMAS, diplomas);
		}
	},
	deleteDiploma: (id: string) => {
		const diplomas = getFromStorage<DiplomaManagement.DiplomaRecord>(STORAGE_KEYS.DIPLOMAS);
		saveToStorage(STORAGE_KEYS.DIPLOMAS, diplomas.filter((d) => d.id !== id));
	},

	// Lookup Logic
	lookup: (params: Partial<DiplomaManagement.DiplomaRecord>): DiplomaManagement.DiplomaRecord[] => {
		const searchFields = ['diplomaNumber', 'registryNumber', 'studentId', 'fullName', 'dateOfBirth'];
		const activeParams = Object.keys(params).filter(
			(key) => searchFields.includes(key) && params[key] !== undefined && params[key] !== '',
		);

		if (activeParams.length < 2) {
			throw new Error('Please provide at least 2 search parameters');
		}

		const diplomas = getFromStorage<DiplomaManagement.DiplomaRecord>(STORAGE_KEYS.DIPLOMAS);
		return diplomas.filter((d) => {
			return activeParams.every((key) => {
				const val = String(d[key]).toLowerCase();
				const searchVal = String(params[key]).toLowerCase();
				return val.includes(searchVal);
			});
		});
	},
};

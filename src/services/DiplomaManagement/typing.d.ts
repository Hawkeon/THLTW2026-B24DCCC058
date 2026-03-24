export namespace DiplomaManagement {
	export interface Registry {
		id: string;
		year: number;
		currentRunningNumber: number;
		[key: string]: any;
	}

	export interface GraduationDecision {
		id: string;
		decisionNumber: string;
		issueDate: string;
		summary: string;
		registryId: string; // Linked to Registry.id
		registryYear: number;
		viewCount: number;
		[key: string]: any;
	}

	export interface TemplateField {
		id: string;
		fieldName: string;
		dataType: 'String' | 'Number' | 'Date';
		[key: string]: any;
	}

	export interface DiplomaRecord {
		id: string;
		registryNumber: number; // Auto-incremented per registry
		diplomaNumber: string;
		studentId: string;
		fullName: string;
		dateOfBirth: string;
		decisionId: string; // Linked to GraduationDecision.id
		dynamicFields: Record<string, any>; // fieldId -> value
		[key: string]: any;
	}
}

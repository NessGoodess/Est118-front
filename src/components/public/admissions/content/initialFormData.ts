import { FormData } from "./admissions";

export const initialFormData: FormData = {
    email: {
        contactEmail: '',
        contactEmailConfirmation: '',
    },

    applicantInfo: {
        firstName: '',
        lastName: '',
        secondLastName: '',
        curp: '',
        birthDate: '',
        age: 0,
        gender: 'O',
        phone: '',
        studentEmail: '',
        placeOfBirth: '',
    },

    academicInfo: {
        previousSchool: '',
        currentAverage: 0,
        hasSiblings: false,
        siblingsDetails: '',
    },

    addressInfo: {
        streetType: '',
        streetName: '',
        houseNumber: '',
        unitNumber: '',
        neighborhoodType: '',
        neighborhoodName: '',
        postalCode: '',
        city: '',
        state: '',
    },

    guardianInfo: {
        guardianFirstName: '',
        guardianLastName: '',
        guardianSecondLastName: '',
        guardianCurp: '',
        guardianPhone: '',
        guardianRelationship: '',
    },

    workshopSelect: {
        workshopFirstChoice: '',
        workshopSecondChoice: '',
    },

    tuitionVoucher: {
        hasSchoolVoucher: false,
        schoolVoucherFolio: '',
    },
};

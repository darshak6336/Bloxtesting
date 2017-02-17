var BLOX = BLOX || {};

BLOX.URL = {

    getApplicationSchema: function() {
        return 'https://devprivasera.com:6199/schema/schemaData.json';
    },

    getDropboxLoginURL: function() {
        return 'https://devprivasera.com:6199/api/dropbox';
    },

    getImportDropboxURL: function() {
        return 'https://devprivasera.com:6199/api/dropbox/import';
    },

    getDashboardURL: function() {
        return 'https://devprivasera.com:6199/api/blox';
    },

    getApplicationURL: function() {
        return 'https://devprivasera.com:6199/api/applications';
    },

    geteMailAutocompleteURL: function() {
        return 'https://devprivasera.com:6199/api/user/autocomplete';
    },

    getshareApplicationURL: function() {
        return 'https://devprivasera.com:6199/api/blox/share';
    },

    executeApplicationURL: function() {
        return 'https://devprivasera.com:6243/run';
    },

    getNewBloxURL: function() {
        return 'https://devprivasera.com:6199/api/blox';
    },

    getDeleteBloxURL: function() {
        return 'https://devprivasera.com:6199/api/blox/delete';
    },

    getFileUploadURL: function() {
        return 'https://devprivasera.com:6199/api/files/upload';
    },

    getDeleteFileURL: function() {
        return 'https://devprivasera.com:6199/api/files/delete'
    },

    getFilesForBlox: function() {
        return 'https://devprivasera.com:6199/api/files';
    },

    getNotifications: function() {
        return 'https://devprivasera.com:6199/api/blox/notifications';
    },

    getNotificationsNew: function() {
        return 'https://devprivasera.com:6199/api/blox/notifications/new';
    },
    putNotificationsNew: function() {
        return 'https://devprivasera.com:6199/api/blox/notifications/new';
    },

    getDeleteNotificationURL: function() {
        return 'https://devprivasera.com:6199/api/notification/delete';
    },

    saveProfileURL: function() {
        return 'https://devprivasera.com:6199/api/user/saveProfile';
    },
    getUserProfile: function() {
        return 'https://devprivasera.com:6199/api/userprofile';
    },
    saveUserCourse: function() {
        return 'https://devprivasera.com:6199/api/user/saveStudentCourse';
    },
    getAllCourses: function() {
        return 'https://devprivasera.com:6199/api/getAllCourses';
    },
    getAllInstructors: function() {
        return 'https://devprivasera.com:6199/api/getAllInstructors';
    },
    postCourses: function() {
        return 'https://devprivasera.com:6199/api/addCourse';
    },

    getCoursesForUser: function() {
        return 'https://devprivasera.com:6199/api/getCourseSummary';
    },

    getStudentCourseById: function() {
        return 'https://devprivasera.com:6199/api/getStudentCourseById';
    },
    logout: function() {
        return 'https://devprivasera.com:6199/logout';
    }


}

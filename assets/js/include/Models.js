$(function()
{

StateModel = function()
{
    this.index = () =>
    {
        return get('States/list');
    }

    this.search = (params) =>
    {
        return post('States/search', params);
    }

    this.baladia_search = (params) =>
    {
        return post('States/Baladia/search', params);
    }
}

SettingsModel = function()
{
    this.setLocale = (locale = 'ar') =>
    {
        ipcIndexRenderer.send('set-locale', locale);

        return new Promise((resolve, reject) =>
        {
            ipcIndexRenderer.removeAllListeners('locale-changed');
            ipcIndexRenderer.on('locale-changed', (e,args) =>
            {
                if( args )
                    resolve(args);
                else
                    reject(args);
            });		
        });
    }

    this.setGeneral = (options) =>
    {
        ipcIndexRenderer.send('set-general-settings', options);

        return new Promise((resolve, reject) =>
        {
            ipcIndexRenderer.removeAllListeners('general-settings-changed');
            ipcIndexRenderer.on('general-settings-changed', (e,args) =>
            {
                if( args )
                    resolve(args);
                else
                    reject(args);
            });		
        });
    }
}

MedicalAnalysisModel = function()
{ 
    this.show = (params) =>
    {
        return post('MedicalAnalysis/show', params);
    }
    
    this.search = (params) =>
    {
        return post('MedicalAnalysis/search', params);
    }

    this.store = (params) =>
    {
        return post('MedicalAnalysis/store', params);
    }

    this.update = (params) =>
    {
        return post('MedicalAnalysis/update', params);
    }

    this.batchDelete = (params) =>
    {
        return post('MedicalAnalysis/batchDelete', params);
    }
}

MedicalAnalysisCategoryModel = function()
{ 
    this.show = (params) =>
    {
        return post('MedicalAnalysis/Categories/show', params);
    }
    
    this.index = () =>
    {
        return get('MedicalAnalysis/Categories/index');
    }

    this.store = (params) =>
    {
        return post('MedicalAnalysis/Categories/store', params);
    }

    this.update = (params) =>
    {
        return post('MedicalAnalysis/Categories/update', params);
    }
}

TreasuryModel = function()
{
    this.store = (params) =>
    {
        var fd = new FormData();
        fd.append('TreasuryObject', JSON.stringify(params));
        if ( params.expense_file )
            fd.append('expense_file', params.expense_file);
        return postForm('Treasury/add', fd);
    }

    this.take = (params) =>
    {
        var fd = new FormData();
        fd.append('TreasuryObject', JSON.stringify(params));
        if ( params.expense_file )
            fd.append('expense_file', params.expense_file);
        return postForm('Treasury/take', fd);
    }

    this.expenses_batchDelete = (params) =>
    {
        return post('Treasury/Expenses/deleteList', {
            list: params
        });
    }

    this.expenses_filterBetweenDates = (params) =>
    {
        return post('Treasury/Expenses/filterBetweenDates', {
            TreasuryObject: params
        });
    }

    this.expenses_filterByDate = (params) =>
    {
        return post('Treasury/Expenses/filterByDate', {
            TreasuryObject: params
        });
    }
}

ClinicModel = function()
{
    this.search = (query) =>
    {
        return post('Clinics/search', {
            query: query
        });
    }

    this.transferPatients = (params) =>
    {
        return post('Clinics/transferPatients', params);
    }

    this.show = (id) =>
    {
        var params = {
            clinicId: id
        }
        return post('Clinics/info', params);
    }

    this.store = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Clinics/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Clinics/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Clinics/deleteList', params);
    }

    this.dept_action_local_search = (params) => 
    {
        return post('Clinics/Depts/Actions/search', params)
    }

    this.dept_action_batchDelete = (params) => 
    {
        return post('Clinics/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Clinics/Depts/pay', params)
    }
}

EmployeeModel = function()
{

    this.types_index = (query = '') =>
    {
        return post('Employees/Types/index', {
            employee_type_target_center: query
        });
    }

    this.type_local_search = (params) =>
    {
        return post('Employees/Types/local_search', params);
    }

    this.type_permission_setBatch = (params) =>
    {
        return post('Employees/Types/Permissions/setBatch', params);
    }

    this.type_permission_index = (params) =>
    {
        return post('Employees/Types/Permissions/index', params);
    }

    this.type_permission_self = () =>
    {
        var params = {
            administration_id: USER_CONFIG.administration_id,
            employee_type_id: USER_CONFIG.employee_type_id
        }
        return post('Employees/Types/Permissions/index', params);
    }

    this.searchLocal = (params) =>
    {
        return post('Employees/searchLocal', {
            SearchObject: params
        });
    }

    this.local_search = (params) =>
    {
        return post('Employees/local_search', params);
    }

    this.search = (params) =>
    {
        return post('Employees/search', params);
    }

    this.local_filterByType = (params) =>
    {
        return post('Employees/local_filterByType', params);
    }

    this.administration_attendance_search = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Employees/Attendance/Administration/search', params);
    }

    this.show = (employee_id, employee_phone = '') =>
    {
        var params = {
            employee_id: employee_id,
            employee_phone: employee_phone
        }
        return post('Employees/info', params);
    }

    this.attendance_set = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/Attendance/set', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }

        return post('Employees/deleteList', params);
    }

    this.update = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/update', params);
    }

    this.store = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/add', params);
    }

    this.distributor_dept_action_local_search = (params) => 
    {
        return post('Employees/Distributor/Depts/Actions/search', params)
    }

    this.distributor_dept_action_batchDelete = (params) => 
    {
        return post('Employees/Distributor/Depts/Actions/batchDelete', params)
    }

    this.distributor_dept_pay = (params) => 
    {
        return post('Employees/Distributor/Depts/pay', params)
    }

    this.distributor_client_show = (params) =>
    {
        return post('Employees/Distributor/Clients/show', params);
    }

    this.distributor_client_local_search = (params) =>
    {
        return post('Employees/Distributor/Clients/local_search', params);
    }

    this.distributor_client_search = (params) =>
    {
        return post('Employees/Distributor/Clients/search', params);
    }

    this.distributor_client_filter = (params) =>
    {
        return post('Employees/Distributor/Clients/filter', params);
    }

    this.distributor_client_batchDelete = (params) =>
    {
        return post('Employees/Distributor/Clients/batchDelete', params);
    }

    this.distributor_client_store = (params) =>
    {
        return post('Employees/Distributor/Clients/store', params);
    }

    this.distributor_client_update = (params) =>
    {
        return post('Employees/Distributor/Clients/update', params);
    }

    this.distributor_client_dept_action_local_search = (params) =>
    {
        return post('Employees/Distributor/Clients/Depts/Actions/local_search', params);
    }

    this.distributor_client_dept_action_batchDelete = (params) =>
    {
        return post('Employees/Distributor/Clients/Depts/Actions/batchDelete', params);
    }

    this.distributor_client_dept_pay = (params) => 
    {
        return post('Employees/Distributor/Clients/Depts/pay', params)
    }

    this.employee_group_for_messaging_batchStore = (params) => 
    {
        return post('Employees/GroupForMessaging/batchStore', params)
    }

    this.employee_group_for_messaging_update = (params) => 
    {
        return post('Employees/GroupForMessaging/update', params)
    }

    this.employee_group_for_messaging_show = (params) => 
    {
        return post('Employees/GroupForMessaging/show', params)
    }

    this.employee_group_for_messaging_showByEmployeeId = (params) => 
    {
        return post('Employees/GroupForMessaging/showByEmployeeId', params)
    }

    this.employee_group_for_messaging_search = (params) => 
    {
        return post('Employees/GroupForMessaging/search', params)
    }

}

EmployeeActionModel = function()
{

    this.searchLocal = (params) =>
    {
        return post('EmployeeActions/searchLocal', params);
    }

    this.filterLocal = (params) =>
    {
        return post('EmployeeActions/filterLocal', params);
    }

    this.batchDelete = (params) =>
    {
        return post('EmployeeActions/batchDelete', params);
    }

}

RingingBellModel = function()
{

    this.store = (params) =>
    {
        return post('RingingBells/store', params);
    }

    this.last_today = (params) =>
    {
        return post('RingingBells/last_today', params);
    }

}

PrescriptionModel = function()
{

    this.patient_local_search = (params) =>
    {
        return post('Prescriptions/Patients/local_search', params)
    }

    this.center_local_search = (params) =>
    {
        return post('Prescriptions/Centers/local_search', params)
    }

    this.center_not_in_orders_local_search = (params) =>
    {
        return post('Prescriptions/Centers/NotInOrders/local_search', params)
    }

    this.center_in_orders_local_search = (params) =>
    {
        return post('Prescriptions/Centers/InOrders/local_search', params)
    }

    this.show = (params) =>
    {
        return post('Prescriptions/info', {
            prescriptionId: params
        });
    }

    this.update = (params) =>
    {
        return post('Prescriptions/update', {
            PrescObject: params
        });
    }

    this.store = (params) =>
    {
        return post('Prescriptions/add', {
            PrescObject: params
        });
    }

    this.batchDelete = (params) =>
    {
        return post('Prescriptions/deleteList', {
            PrescObject: params
        });
    }

}

PatientModel = function()
{
    this.batchStore = (params) =>
    {
        return post('Patients/batchStore', params);
    }

    this.store = (params) =>
    {
        return post('Patients/add', {
            PatientObject:params
        });
    }

    this.update = (params) =>
    {
        return post('Patients/update', {
            PatientObject:params
        });
    }

    this.batchUpdateWilayaBaladia = (params) =>
    {
        return post('Patients/batchUpdateWilayaBaladia', params);
    }

    this.show = (params) =>
    {
        return post('Patients/info', {
            patientId:params
        });
    }

    this.search = (query) =>
    {
        return post('Patients/search', {
            query:query
        });
    }

    this.advancedSearch = (params) =>
    {
        return post('Patients/advancedSearch', params);
    }

    this.searchLocal = (params) =>
    {
        return post('Patients/searchLocal', {
            SearchObject:params
        });
    }

    this.local_filter = (params) =>
    {
        return post('Patients/local_filter', params);
    }

    this.hasChronicDisease_local_search = (params) =>
    {
        return post('Patients/hasChronicDisease_local_search', {
            SearchObject:params
        });
    }

    this.hasApt_local_search = (params) =>
    {
        return post('Patients/hasApt_local_search', {
            SearchObject:params
        });
    }

    this.batchDelete = (params) =>
    {
        return post('Patients/deleteList', {
            list:params
        });
    }

    this.changedSettings = (params) =>
    {
        var advancedSearch = {
            advanced: {
                orderBy: 'id',
                order: 'desc'
            }
        }

        params = {...advancedSearch, ...params}

        return post('Patients/listChangedSettings', {
            SearchObject:params
        });
    }

    this.deleteChangedSetting = (params) =>
    {
        return post('Patients/deleteChangedSetting', {
            PatientObject:params
        });
    }

    this.storeChangedSetting = (params, callback) =>
    {
        var fd = new FormData();

        fd.append('PatientObject', JSON.stringify(params));
        if ( params.patient_doc )
            fd.append('patient_doc', params.patient_doc);

        return postFormWithProgress('Patients/addChangedSettings', fd, callback);
    }

    this.medicalTest_store = (params, images, callback) =>
    {
        var fd = new FormData;

        fd.append('PatientObject', JSON.stringify(params));
        //console.log(images);
        for (let i = 0; i < images.length; i++)
        {
            var image = images[i];
            fd.append('images[]', image);
        }

        return postFormWithProgress('Patients/MedicalTests/store', fd, callback);
    }

    this.medicalTest_index = (id) =>
    {
        var params = {
            patientId: id
        }

        return post('Patients/MedicalTests/index', params);
    }

    this.medicalTest_delete = (id) =>
    {
        var params = {
            id: id
        }

        return post('Patients/MedicalTests/delete', params);
    }

    this.album_index = (id) =>
    {
        var params = {
            patientId: id
        }

        return post('Patients/Albums/index', params);
    }

    this.album_store = (params, images, callback) =>
    {
        var fd = new FormData;

        fd.append('PatientObject', JSON.stringify(params));
        //console.log(images);
        for (let i = 0; i < images.length; i++)
        {
            var image = images[i];
            fd.append('images[]', image);
        }

        return postFormWithProgress('Patients/Albums/store', fd, callback);
    }

    this.album_delete = (id) =>
    {
        var params = {
            id: id
        }

        return post('Patients/Albums/delete', params);
    }

    this.dept_set = (params) =>
    {
        params = {
            PatientObject: params
        }

        return post('Patients/Depts/set', params);
    }

    this.dept_action_local_search = (params) => 
    {
        return post('Patients/Depts/Actions/search', params)
    }

    this.dept_action_batchDelete = (params) => 
    {
        return post('Patients/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Patients/Depts/pay', params)
    }

    this.partial_body_analisys__store = (params, callback) =>
    {
        return postFormWithProgress('Patients/PartialBodyAnalisys/store', params, callback);
    }

    this.partial_body_analisys__search = (params) =>
    {
        return post('Patients/PartialBodyAnalisys/search', params);
    }

    this.partial_body_analisys__delete = (params) =>
    {
        return post('Patients/PartialBodyAnalisys/delete', params);
    }
   
}

PatientStatModel = function()
{

    this.index_chart = (params) =>
    {
        return post('Patients/Stats/index_chart', params);
    }

    this.byCenter_chart = (params) =>
    {
        return post('Patients/Stats/byCenter_chart', params);
    }

    this.byState_chart = (params) =>
    {
        return post('Patients/Stats/byState_chart', params);
    }

}

PatientMedicalAnalysisModel = function()
{
    this.store = (params) =>
    {
        return post('PatientMedicalAnalysis/store', params);
    }

    this.update = (params) =>
    {
        return post('PatientMedicalAnalysis/update', params);
    }

    this.show = (params) =>
    {
        return post('PatientMedicalAnalysis/show', params);
    }

    this.batchDelete = (params) =>
    {
        return post('PatientMedicalAnalysis/batchDelete', params);
    }

    this.searchLocal = (params) =>
    {
        return post('PatientMedicalAnalysis/searchLocal', params);
    }
   
}

CertificateModel = function()
{

    this.searchLocal = (params) =>
    {
        return post('Certificates/searchLocal', params)
    }

    this.show = (params) =>
    {
        return post('Certificates/show', params);
    }

    this.update = (params) =>
    {
        return post('Certificates/update', params);
    }

    this.store = (params) =>
    {
        return post('Certificates/store', params);
    }

    this.batchDelete = (params) =>
    {
        return post('Certificates/batchDelete', params);
    }

}

HealthyKitchenPostModel = function()
{ 
    this.show = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/show', params);
    }
    
    this.search = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/search', params);
    }

    this.store = (params) =>
    {
        return postForm('LandingPage/HealthyKitchenPosts/store', params);
    }

    this.update = (params) =>
    {
        return postForm('LandingPage/HealthyKitchenPosts/update', params);
    }

    this.batchDelete = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/batchDelete', params);
    }
}

TreatmentClassModel = function()
{ 
    this.local_index = (params) =>
    {
        return post('TreatmentClasses/listLocal', params);
    }

    this.index = () =>
    {
        return post('TreatmentClasses/listAll', {});
    }

    this.show = (id) =>
    {
        var params = {
            classId: id
        }
        return post('TreatmentClasses/info', params);
    }
    
    this.search = (params) =>
    {
        return post('TreatmentClasses/search', params);
    }

    this.store = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('TreatmentClasses/batchDelete', params);
    }

    this.setBatchForCenter = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/setBatchForCenter', params);
    }
}

AppointmentModel = function()
{ 

    this.specialCase_args_index = () =>
    {
        return post('Appointements/SpecialCases/Args/index', {});
    }

    this.specialCase_args_search = (params) =>
    {
        return post('Appointements/SpecialCases/Args/search', params);
    }

    this.specialCase_search = (params) =>
    {
        return post('Appointements/SpecialCases/search', params);
    }

    this.specialCase_filter = (params) =>
    {
        return post('Appointements/SpecialCases/filter', params);
    }

    this.specialCase_batchDelete = (params) =>
    {
        return post('Appointements/SpecialCases/batchDelete', params);
    }

    this.specialCase_store = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        
        return post('Appointements/SpecialCases/store', params);
    }

    this.specialCase_batchStore = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        
        return post('Appointements/SpecialCases/batchStore', params);
    }

    this.show = (params) =>
    {
        return post('Appointements/info', params);
    }
    
    this.search = (params) =>
    {
        return post('Appointements/search', params);
    }

    this.private_batchReStore = (params) =>
    {
        return post('Appointements/Private/batchReStore', params);
    }

    this.batchStore = (params) =>
    {
        return post('Appointements/Private/batchStore', params);
    }

    this.store = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        var data = {
            AppointementObject: params
        }

        return post('Appointements/add', data);
    }

    this.update = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        var data = {
            AppointementObject: params
        }

        return post('Appointements/update', data);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            employee_id: USER_CONFIG.employee_id,
            list: list
        }
        return post('Appointements/deleteList', params);
    }

    this.private_setPaid = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setPaid', params);
    }

    this.private_setAttendance = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setAttendance', params);
    }

    this.private_setTreated = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setTreated', params);
    }

    this.private_setAccepted = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setAccepted', params);
    }

    this.private_local_filterByDate = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/local_filterByDate', params);
    }

    this.private_local_filterByClass = (params) =>
    {
        return post('Appointements/Private/local_filterByClass', params);
    }

    this.private_local_search = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/local_search', params);
    }

    this.private_searchLocal = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/searchLocal', params);
    }

    this.private_patient_search = (params) =>
    {
        return post('Appointements/Private/Patients/search', params);
    }

    this.private_archive_search = (params) =>
    {
        return post('Appointements/Private/Archives/search', params);
    }

    this.followup_local_search = (params) =>
    {
        return post('Appointements/FollowUps/local_search', params);
    }

    this.followup_setPatientAttendance = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/FollowUps/setPatientAttendance', params);
    }

    this.followup_sessions_index = (aptId) =>
    {
        var params = {
            aptId: aptId
        }

        return post('Appointements/FollowUps/Sessions/index', params);
    }

    this.followup_sessions_patients = (session_id) =>
    {
        var params = {
            session_id: session_id
        }

        return post('Appointements/FollowUps/Sessions/Patients/index', params);
    }

    this.followup_update = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        params['AppointementObject'] = params;

        return post('Appointements/FollowUps/update', params);
    }

    this.followup_store = (params) =>
    {
        return post('Appointements/FollowUps/store', {
            AppointementObject: params
        });
    }

    this.followup_session_patient_batchStore = (params) =>
    {
        return post('Appointements/FollowUps/Sessions/Patients/batchStore', {
            AppointementObject: params
        });
    }

}

OnlineAppointmentModel = function()
{ 
    this.show = (id) =>
    {
        var params = {
            apt_id: id
        }
        return post('OnlineAppointements/info', params);
    }
    
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('OnlineAppointements/search', params);
    }

    this.store = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('OnlineAppointements/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('OnlineAppointements/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('OnlineAppointements/deleteList', params);
    }

    this.setAccepted = (params) =>
    {
        params = {
            AppointementObject: params
        }
        return post('OnlineAppointements/setAccepted', params);
    }
}

MessageModel = function()
{

    this.batchSetRead = (params) =>
    {
        return post('Messages/setReadList', params)
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Messages/removeList', params);
    }

    this.reply = (params) =>
    {
        params = {
            MessageObject:params
        }
        return post('Messages/reply', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Messages/search', params);
    }

    this.inbox = (params) =>
    {
        params = {
            MessageObject:params
        }
        return post('Messages/inbox', params);
    }

    this.replies = (params) =>
    {
        params = {
            MessageObject:params
        }
        return post('Messages/replies', params);
    }

    this.open = (params) =>
    {
        params = {
            MessageObject: params
        }
        return post('Messages/open', params);
    }

    this.send = (params) =>
    {
        var fd = new FormData();
        fd.append('MessageObject', JSON.stringify(params));

        if ( params.attachments )
        {
            for (var i = 0; i < params.attachments.length; i++) 
            {
                fd.append('attachments[]', params.attachments[i]);
            }	
        }

        return postForm('Messages/send', fd);
    }

}

ProductModel = function()
{ 
    this.show = (id) =>
    {
        var params = {
            productId: id
        }
        return post('Products/info', params);
    }

    this.center_local_search = (params) =>
    {
        return post('Products/Centers/local_search', params);
    }

    this.center_show = (params) =>
    {
        return post('Products/Centers/show', params);
    }

    this.distributor_local_search = (params) =>
    {
        return post('Products/Distributors/local_search', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Products/search', params);
    }

    this.central_administration_batchStore = (params) =>
    {
        return post('Products/CentralAdministration/batchStore', params);
    }

    this.update = (params) =>
    {
        var fd = new FormData();
        fd.append('ProductObject', JSON.stringify(params));
        if ( params.productImage )
            fd.append('productImage', params.productImage);

        return postForm('Products/update', fd);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Products/deleteList', params);
    }

    this.center_batchDelete = (params) =>
    {
        return post('Products/Centers/batchDelete', params);
    }

    this.center_batchStore = (params) =>
    {
        return post('Products/Centers/batchStore', params);
    }

    this.distributor_batchStore = (params) =>
    {
        return post('Products/Distributors/batchStore', params);
    }

    this.distributor_batchDelete = (params) =>
    {
        return post('Products/Distributors/batchDelete', params);
    }
}

SupplierModel = function()
{

    this.show = (params) =>
    {
        return post('Suppliers/info', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Suppliers/search', params);
    }

    this.store = (params) => 
    {
        var fd = new FormData()
        fd.append('SupplierObject', JSON.stringify(params))
        if ( params.image )
            fd.append('image', params.image)

        return postForm('Suppliers/store', fd)
    }

    this.update = (params) => 
    {
        var fd = new FormData()
        fd.append('SupplierObject', JSON.stringify(params))
        if ( params.image )
            fd.append('image', params.image)

        return postForm('Suppliers/update', fd)
    }

    this.batchDelete = (params) => 
    {
        return post('Suppliers/deleteList', params)
    }

    this.dues_action_local_search = (params) => 
    {
        return post('Suppliers/Dues/Actions/search', params)
    }

    this.dues_action_batchDelete = (params) => 
    {
        return post('Suppliers/Dues/Actions/batchDelete', params)
    }

    this.dues_pay = (params) => 
    {
        return post('Suppliers/Dues/pay', params)
    }

}

OrderModel = function()
{
    this.show = (params) =>
    {
        return post('Orders/info', params)
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('Orders/deleteList', params);
    }

    this.center_shipping_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Orders/Centers/Shipping/search', params);
    }

    this.center_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Orders/Centers/search', params);
    }

    this.direction_supplier_to_central_administration_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_selling_local_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationSellingInvoice/local_search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_local_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_center_consommables_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_consommables_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_distributor_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_distributor_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorSellingInvoice/filter', params);
    }

    this.direction_center_to_client_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/store', params);
    }

    this.direction_center_to_client_selling__client__center_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/Clients/client__center_local_search', params);
    }

    this.direction_center_to_client_selling__client_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_center_to_client_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/search', params);
    }

    this.direction_center_to_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/local_search', params);
    }

    this.direction_center_to_external_client_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/External/store', params);
    }

    this.direction_center_to_external_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/External/local_search', params);
    }

    this.direction_distributor_to_client_selling_store = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/store', params);
    }

    this.direction_distributor_to_client_selling_store_from_formalOrder = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/store_from_formalOrder', params);
    }

    this.direction_distributor_to_client_selling_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/search', params);
    }

    this.direction_distributor_to_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/local_search', params);
    }

    this.direction_distributor_to_client_selling__client_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_distributor_to_client_selling__client__distributor_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/Clients/client__distributor_local_search', params);
    }

    // return invoices
    this.direction_client_to_center_return_store = (params) =>
    {
        return post('Orders/Direction/ClientToCenterReturnInvoice/store', params);
    }

    this.direction_client_to_center_return_search = (params) =>
    {
        return post('Orders/Direction/ClientToCenterReturnInvoice/search', params);
    }

    this.direction_central_administration_to_supplier_return_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToSupplierReturnInvoice/store', params);
    }

    this.direction_central_administration_to_supplier_return_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToSupplierReturnInvoice/search', params);
    }

    this.direction_client_to_distributor_return_store = (params) =>
    {
        return post('Orders/Direction/ClientToDistributorReturnInvoice/store', params);
    }

    this.direction_client_to_distributor_return_search = (params) =>
    {
        return post('Orders/Direction/ClientToDistributorReturnInvoice/search', params);
    }

    this.accept = (id) =>
    {
        var params = {
            order_id:id
        }
        return post('Orders/accept', params);
    }

}

FormalOrderModel = function()
{
    this.show = (params) =>
    {
        return post('FormalOrders/info', params)
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('FormalOrders/deleteList', params);
    }

    this.direction_supplier_to_central_administration_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationSellingInvoice/local_search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_center_consommables_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_consommables_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_distributor_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToDistributorSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_distributor_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToDistributorSellingInvoice/filter', params);
    }

    this.direction_center_to_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/store', params);
    }

    this.direction_center_to_client_selling__client__center_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/Clients/client__center_local_search', params);
    }

    this.direction_center_to_client_selling__client_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_center_to_client_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/search', params);
    }

    this.direction_center_to_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/local_search', params);
    }

    this.direction_center_to_external_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/External/store', params);
    }

    this.direction_center_to_external_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/External/local_search', params);
    }

    this.direction_distributor_to_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/store', params);
    }

    this.direction_distributor_to_client_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/search', params);
    }

    this.direction_distributor_to_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/local_search', params);
    }

    this.direction_distributor_to_client_selling__client_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_distributor_to_client_selling__client__distributor_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/Clients/client__distributor_local_search', params);
    }

}

ConsommableModel = function()
{

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('Consommables/batchDelete', params);
    }

    this.show = (id) =>
    {
        var params = {
            id:id
        }
        return post('Consommables/info', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Consommables/search', params);
    }

    this.central_administration_batchStore = (params) =>
    {
        return post('Consommables/CentralAdministration/batchStore', params);
    }

    this.update = (params) =>
    {
        return postForm('Consommables/update', params);
    }

    this.center_local_search = (params) =>
    {
        return post('Consommables/Centers/local_search', params);
    }

    this.center_batchDelete = (params) =>
    {
        return post('Consommables/Centers/batchDelete', params);
    }

    this.center_batchStore = (params) =>
    {
        return post('Consommables/Centers/batchStore', params);
    }

    this.patient_batchStore = (params) =>
    {
        return post('Consommables/Patients/batchStore', params);
    }

    this.patient_local_search = (params) =>
    {
        return post('Consommables/Patients/local_search', params);
    }

}

CashoutRecordModel = function()
{

    this.store = (params) =>
    {
        params = {
            CashoutRecordObject:params
        }
        return post('CashoutRecords/add', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('CashoutRecords/deleteList', params);
    }

    this.administration_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('CashoutRecords/Administration/search', params);
    }

}

DailyReportModel = function()
{

    this.store = (params) =>
    {
        return post('DailyReports/store', params);
    }

    this.update = (params) =>
    {
        return post('DailyReports/update', params);
    }

    this.show = (params) =>
    {
        return post('DailyReports/show', params);
    }

    this.employee_search = (params) =>
    {
        return post('DailyReports/Employees/search', params);
    }

    this.batchDelete = (params) =>
    {
        return post('DailyReports/batchDelete', params);
    }

    this.staff_search = (params) =>
    {
        return post('DailyReports/Staff/search', params);
    }

    this.staff_filter = (params) =>
    {
        return post('DailyReports/Staff/filter', params);
    }

    this.global_search = (params) =>
    {
        return post('DailyReports/Global/search', params);
    }

    this.global_filter = (params) =>
    {
        return post('DailyReports/Global/filter', params);
    }

}

MemberModel = function()
{
    this.setSeenByAdmin = (params) =>
    {
        return post('Members/setSeenByAdmin', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Members/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            member_id: id
        }
        return post('Members/info', params);
    }

    this.store = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Members/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Members/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Members/deleteList', params);
    }
}

TestimonialModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Testimonials/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            test_id: id
        }
        return post('Testimonials/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Testimonials/deleteList', params);
    }
}

AdvertisementModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Advertisements/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            ad_id: id
        }
        return post('Advertisements/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/deleteList', params);
    }

    this.update = (params) =>
    {
        var fd = new FormData();
        fd.append('AdvertisementObject', JSON.stringify(params));
        if ( params.ad_image )
            fd.append('ad_image', params.ad_image);

        return postForm('Advertisements/update', fd);
    }

    this.store = (params) =>
    {
        var fd = new FormData();
        fd.append('AdvertisementObject', JSON.stringify(params));
        if ( params.ad_image )
            fd.append('ad_image', params.ad_image);

        return postForm('Advertisements/store', fd);
    }

    this.types_list = () =>
    {
        var params = {
            
        }
        return post('Advertisements/Types/index', params);
    }

    this.clients_batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/Clients/deleteList', params);
    }

    this.clients_search = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/Clients/search', params);
    }
}

VideoModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Videos/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            video_id: id
        }
        return post('Videos/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Videos/deleteList', params);
    }

    this.update = (params) =>
    {
        params = {
            VideoObject: params
        }

        return post('Videos/update', params);
    }

    this.store = (params) =>
    {
        params = {
            VideoObject: params
        }

        return post('Videos/add', params);
    }

}

FileModel = function()
{
    this.index = (params) =>
    {
        return get('Files/index?directory='+params.directory);
    }

    this.upload = (params, progress) =>
    {
        return postFormWithProgress('Files/upload', params, progress);
    }

    this.convert_ppt_to_jpg = (params, progress = null) =>
    {
        return postFormWithProgress('Files/Converts/PPT_TO_JPG/convert', params, progress);
    }
}

WaitingListModel = function()
{

    this.store = (params) =>
    {
        return post('WaitingLists/store', params)
    }

    this.local_search = (params) =>
    {
        return post('WaitingLists/local_search', params)
    }

    this.batchDelete = (params) =>
    {
        return post('WaitingLists/batchDelete', params)
    }

    this.delete = (params) =>
    {
        return post('WaitingLists/delete', params)
    }

}

SMSTemplateModel = function()
{

    this.store = (params) =>
    {
        return post('SMSMessage/store', params)
    }

    this.update = (params) =>
    {
        return post('SMSMessage/update', params)
    }

    this.show = (params) =>
    {
        return post('SMSMessage/show', params)
    }

    this.local_search = (params) =>
    {
        return post('SMSMessage/Centers/search', params)
    }

    this.delete = (params) =>
    {
        return post('SMSMessage/delete', params)
    }

}

FundBoxModel = function()
{

    this.show = (params) =>
    {
        return post('FundBoxes/show', params);
    }

    this.search = (params) =>
    {
        return post('FundBoxes/search', params);
    }

    this.filter = (params) =>
    {
        return post('FundBoxes/filter', params);
    }

    this.store = (params) => 
    {
        return post('FundBoxes/store', params)
    }

    this.update = (params) => 
    {
        return post('FundBoxes/update', params)
    }

    this.batchDelete = (params) => 
    {
        return post('FundBoxes/batchDelete', params)
    }

    this.actions_store = (params) =>
    {
        return postForm('FundBoxes/Actions/store', params);
    }

    this.actions_batchDelete = (params) =>
    {
        return post('FundBoxes/Actions/batchDelete', params);
    }

    this.actions_funds_transfer = (params) =>
    {
        return postForm('FundBoxes/Actions/Funds/transfer', params);
    }

    this.actions_funds_store = (params) =>
    {
        return postForm('FundBoxes/Actions/Funds/store', params);
    }

    this.actions_search = (params) =>
    {
        return post('FundBoxes/Actions/search', params);
    }

    this.actions_owner_search = (params) =>
    {
        return post('FundBoxes/Actions/Owners/search', params);
    }

    this.actions_owner_filterBySource = (params) =>
    {
        return post('FundBoxes/Actions/Owners/filterBySource', params);
    }

    this.actions_owner_show = (params) =>
    {
        return post('FundBoxes/Actions/Owners/show', params);
    }

    this.actions_funds_transfer_batchConfirm = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Funds/transfer_batchConfirm', params);
    }

    this.unconfirmed_actions_batchDelete = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/batchDelete', params);
    }

    this.unconfirmed_actions_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/search', params);
    }

    this.unconfirmed_actions_owner_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Owners/search', params);
    }

    this.unconfirmed_actions_owner_filterBySource = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Owners/filterBySource', params);
    }

    this.unconfirmed_actions_source_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Sources/search', params);
    }

    this.unconfirmed_actions_source_filterBySource = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Sources/filterByOwner', params);
    }

}

ContentTemplateModel = function()
{

    this.store = (params) =>
    {
        return post('ContentTemplates/store', params)
    }

    this.update = (params) =>
    {
        return post('ContentTemplates/update', params)
    }

    this.show = (params) =>
    {
        return post('ContentTemplates/show', params)
    }

    this.local_search = (params) =>
    {
        return post('ContentTemplates/Centers/search', params)
    }

    this.delete = (params) =>
    {
        return post('ContentTemplates/delete', params)
    }

}

CategoryModel = function()
{
    this.search = (params) =>
    {
        return post('Categories/search', params);
    }

    this.show = (params) =>
    {
        return post('Categories/show', params);
    }

    this.delete = (params) =>
    {
        return post('Categories/delete', params);
    }

    this.update = (params) =>
    {
        return post('Categories/update', params);
    }

    this.store = (params) =>
    {
        return post('Categories/store', params);
    }

}

NotificationModel = function()
{

    this.setIsRead = (params) =>
    {
        return post('Notifications/setIsRead', params);
    }

    this.receiver_search = (params) =>
    {
        return post('Notifications/Receivers/search', params);
    }

    this.receiver_isRead_count = (params) =>
    {
        return post('Notifications/Receivers/IsRead/count', params);
    }

}

DriverJobModel = function()
{
    this.search = (params) =>
    {
        return post('DriverJobs/search', params);
    }

    this.filterByDriver = (params) =>
    {
        return post('DriverJobs/filterByDriver', params);
    }

    this.filterByStatus = (params) =>
    {
        return post('DriverJobs/filterByStatus', params);
    }

    this.show = (params) =>
    {
        return post('DriverJobs/show', params);
    }

    this.batchDelete = (params) =>
    {
        return post('DriverJobs/batchDelete', params);
    }

    this.update = (params) =>
    {
        return post('DriverJobs/update', params);
    }

    this.setDriver = (params) =>
    {
        return post('DriverJobs/setDriver', params);
    }

    this.store = (params) =>
    {
        return post('DriverJobs/store', params);
    }

    this.employee_job_search = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/search', params);
    }

    this.employee_job_filterByDriver = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/filterByDriver', params);
    }

    this.employee_job_filterByStatus = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/filterByStatus', params);
    }

    this.driver_job_cancel = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/cancel', params);
    }

    this.driver_job_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/search', params);
    }

    this.driver_job_tracking_store = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/store', params);
    }

    this.driver_job_tracking_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/search', params);
    }

    this.driver_job_tracking__job_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/job_search', params);
    }

    this.driver_job_canceled_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Canceled/search', params);
    }

    this.driver_job_canceled_filterByDriver = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Canceled/filterByDriver', params);
    }

}

ChronicDiseaseModel = function()
{
    this.search = (params) =>
    {
        return post('ChronicDiseases/search', params);
    }

    this.show = (params) =>
    {
        return post('ChronicDiseases/show', params);
    }

}

ChatModel = function()
{
    this.group_store = (params) =>
    {
        return post('Chats/Groups/store', params);
    }

    this.group_update = (params) =>
    {
        return post('Chats/Groups/update', params);
    }

    this.group_show = (params) =>
    {
        return post('Chats/Groups/show', params);
    }

    this.group_search = (params) =>
    {
        return post('Chats/Groups/search', params);
    }

    this.group_patient_batchStore = (params) =>
    {
        return post('Chats/Groups/Patients/batchStore', params);
    }

    this.group_patient_search = (params) =>
    {
        return post('Chats/Groups/Patients/search', params);
    }

    this.group_patient_show = (params) =>
    {
        return post('Chats/Groups/Patients/show', params);
    }

    this.group_employee_show = (params) =>
    {
        return post('Chats/Groups/Employees/show', params);
    }

    this.group_post_store = (params) =>
    {
        return post('Chats/Groups/Posts/store', params);
    }

    this.group_post_update = (params) =>
    {
        return post('Chats/Groups/Posts/update', params);
    }

    this.group_post_show = (params) =>
    {
        return post('Chats/Groups/Posts/show', params);
    }

    this.group_post_search = (params) =>
    {
        return post('Chats/Groups/Posts/search', params);
    }

    this.group_post_batchDelete = (params) =>
    {
        return post('Chats/Groups/Posts/batchDelete', params);
    }

    this.group_post_reaction_store = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/store', params);
    }

    this.group_post_reaction_delete = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/delete', params);
    }

    this.group_post_reaction_deleteByPostAndEmployee = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/deleteByPostAndEmployee', params);
    }

    this.group_post_reaction_search = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/search', params);
    }

    this.group_post_comment_store = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/store', params);
    }

    this.group_post_comment_update = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/update', params);
    }

    this.group_post_comment_batchDelete = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/batchDelete', params);
    }

    this.group_post_comment_search = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/search', params);
    }

    this.group_post_comment_show = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/show', params);
    }

    this.conversation_private_store = (params) =>
    {
        return post('Chats/Conversations/Private/store', params);
    }

    this.conversation_private_show = (params) =>
    {
        return post('Chats/Conversations/Private/show', params);
    }

    this.conversation_private_search = (params) =>
    {
        return post('Chats/Conversations/Private/search', params);
    }

    this.conversation_private_delete = (params) =>
    {
        return post('Chats/Conversations/Private/delete', params);
    }

    this.conversation_private_setRead = (params) =>
    {
        return post('Chats/Conversations/Private/setRead', params);
    }

    this.conversation_group_store = (params) =>
    {
        return post('Chats/Conversations/Group/store', params);
    }

    this.conversation_group_show = (params) =>
    {
        return post('Chats/Conversations/Group/show', params);
    }

    this.conversation_group_search = (params) =>
    {
        return post('Chats/Conversations/Group/search', params);
    }

    this.conversation_group_delete = (params) =>
    {
        return post('Chats/Conversations/Group/delete', params);
    }

    this.conversation_group_setRead = (params) =>
    {
        return post('Chats/Conversations/Group/setRead', params);
    }

}

EmojyModel = function()
{
    this.search = (params) =>
    {
        return post('Emojies/search', params);
    }

    this.store = (params) =>
    {
        return post('Emojies/batchStore', params);
    }
}

MediaModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.create = (params, progress) =>
    {
        return postFormWithProgress('medias/create', params, progress, options);
    }

    this.search = (params) =>
    {
        return post('medias/search', params, options);
    }

    this.delete = (id) =>
    {
        return _delete('medias/delete/'+id, options);
    }
}

StatisticsModel = function()
{

    this.fundbox_appointment_search = (params) =>
    {
        return post('Statistics/Fundboxes/Appointements/search', params);
    }

    this.appointment_search = (params) =>
    {
        return post('Statistics/Appointements/search', params);
    }

    this.prescription_search = (params) =>
    {
        return post('Statistics/Prescriptions/search', params);
    }

    this.order_search = (params) =>
    {
        return post('Statistics/Orders/search', params);
    }

    this.patient_search = (params) =>
    {
        return post('Statistics/Patients/search', params);
    }

    this.patient_dept_action_search = (params) =>
    {
        return post('Statistics/Patients/Depts/Actions/search', params);
    }

    this.product_center_search = (params) =>
    {
        return post('Statistics/Products/Centers/search', params);
    }

    this.consummable_center_search = (params) =>
    {
        return post('Statistics/Consummables/Centers/search', params);
    }

}
    
})



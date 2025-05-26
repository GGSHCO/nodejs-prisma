BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[academyCartTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [courseName] NVARCHAR(max),
    [image] NVARCHAR(max),
    [amount] NVARCHAR(max),
    [totalAmount] NVARCHAR(max),
    [addedTime] DATE,
    [activeUser] NVARCHAR(255),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    CONSTRAINT [PK__academyC__DE105D07AFF89EAF] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyCateoryTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [category] NVARCHAR(max),
    [categoryHeading] NVARCHAR(max),
    [categoryDescription] NVARCHAR(max),
    [addedTime] DATE,
    [activeUser] NVARCHAR(255),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [status] NVARCHAR(100),
    CONSTRAINT [PK__academyC__DE105D075C134860] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyContact] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(max),
    [email] NVARCHAR(max),
    [phone] NVARCHAR(max),
    [message] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [subject] NVARCHAR(max),
    CONSTRAINT [PK__academyC__DE105D07CC1D07CA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyCounselling] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [carrerName] NVARCHAR(max),
    [carrerAge] INT,
    [carrerEducation] NVARCHAR(max),
    [carrerEmail] NVARCHAR(max),
    [carrerMessage] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [counsellorName] NVARCHAR(max),
    [counsellorDepartment] NVARCHAR(max),
    CONSTRAINT [PK__academyC__DE105D0730FBCE2F] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyCounsellor] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [counsellorName] NVARCHAR(max),
    [counsellorDepartment] NVARCHAR(max),
    [counsellorEmail] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    CONSTRAINT [PK__academyC__DE105D07BB8B32A1] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyEvent] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [eventName] NVARCHAR(max),
    [eventDate] DATE,
    [eventTime] TIME,
    [zoomLink] NVARCHAR(max),
    [eventEndTime] TIME,
    [eventStatus] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [recordingLink] NVARCHAR(max),
    CONSTRAINT [PK__academyE__DE105D07C29A55C9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyTutor] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [tutorName] NVARCHAR(max),
    [tutorAge] INT,
    [tutorEducation] NVARCHAR(max),
    [tutorExperience] NVARCHAR(max),
    [tutorMessage] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [tutorEmail] NVARCHAR(255),
    [tutorPhone] NVARCHAR(100),
    [tutorLocation] NVARCHAR(max),
    [jobPrefered] NVARCHAR(100),
    [linkedProfile] NVARCHAR(max),
    [tutorResume] NVARCHAR(max),
    [joinReason] NVARCHAR(max),
    [availability] DATETIME2,
    [workType] NVARCHAR(100),
    [tutorMail] NVARCHAR(255),
    [tutorMobile] NVARCHAR(100),
    [tutorAddress] NVARCHAR(max),
    [tutorPreferedJob] NVARCHAR(100),
    [tutorLinkedProfile] NVARCHAR(max),
    [tutorResumeUpload] NVARCHAR(max),
    [tutorjoinReason] NVARCHAR(max),
    [tutorAvailability] DATETIME2,
    [tutorWorkType] NVARCHAR(100),
    CONSTRAINT [PK__academyT__DE105D079318A487] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[academyWishlist] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [courseName] NVARCHAR(max),
    [image] NVARCHAR(max),
    [amount] NVARCHAR(max),
    [addedTime] DATE,
    [activeUser] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    CONSTRAINT [PK__academyW__DE105D07B735E56B] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[accountingPolicy] (
    [lid] INT NOT NULL,
    [head] NVARCHAR(max),
    [policy] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__accounti__DE105D072BDF9974] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[adjustment_tb] (
    [lid] INT NOT NULL,
    [adjEntry] INT,
    [clientName] NVARCHAR(max),
    [rawCoa] NVARCHAR(max),
    [debit] DECIMAL(18,0),
    [credit] DECIMAL(18,0),
    [remarks] NVARCHAR(max),
    [net] DECIMAL(18,0),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [finaNcialYear] NVARCHAR(max),
    CONSTRAINT [PK__adjustme__DE105D071503BBB3] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[All_Clients] (
    [Auto_Number] NVARCHAR(max),
    [Client_Code] NVARCHAR(max),
    [Name] NVARCHAR(max),
    [Group_name] NVARCHAR(max),
    [Client_advisor] NVARCHAR(max),
    [Email_POC] NVARCHAR(max),
    [Entity_Type] NVARCHAR(max),
    [Type] NVARCHAR(max),
    [is_Active] NVARCHAR(max),
    [Individual_Type] NVARCHAR(max),
    [CIN] NVARCHAR(max),
    [LLPIN] NVARCHAR(max),
    [DIN_or_DPIN] NVARCHAR(max),
    [Mobile_1] NVARCHAR(max),
    [Mobile_2] NVARCHAR(max),
    [Reg_Office] NVARCHAR(max),
    [Branch_or_Additional_Address] NVARCHAR(max),
    [DOB_or_DOI_or_DOR] NVARCHAR(max),
    [Added_User] NVARCHAR(max),
    [Added_Time] NVARCHAR(max),
    [Modified_User] NVARCHAR(max),
    [Modified_Time] NVARCHAR(max),
    [Companys_Website] NVARCHAR(max),
    [GSTIN] NVARCHAR(max),
    [GST_Login_credentials] NVARCHAR(max),
    [GST_login_password] NVARCHAR(max),
    [PAN] NVARCHAR(max),
    [IT_login_password] NVARCHAR(max),
    [TAN] NVARCHAR(max),
    [Traces_User_ID] NVARCHAR(max),
    [Traces_Password] NVARCHAR(max),
    [ITD_TAN_ID] NVARCHAR(max),
    [ITD_TAN_PW] NVARCHAR(max),
    [Head_Contact_1] NVARCHAR(max),
    [Lead_Accountant_Contact_1] NVARCHAR(max),
    [Other_functional_contact] NVARCHAR(max),
    [Head_Contact_2] NVARCHAR(max),
    [Director_or_DP_or_P_1] NVARCHAR(max),
    [Director_or_DP_or_P_2] NVARCHAR(max),
    [Director_or_DP_or_P_3] NVARCHAR(max),
    [Director_or_DP_or_P_4] NVARCHAR(max),
    [Director_or_DP_or_P_5] NVARCHAR(max),
    [IT_Filing] NVARCHAR(max),
    [Statutory_Audit] NVARCHAR(max),
    [Tax_Audit] NVARCHAR(max),
    [GST_Monthly_returns] NVARCHAR(max),
    [GST_Audit] NVARCHAR(max),
    [GST_Annual_return] NVARCHAR(max),
    [GST_Refund] NVARCHAR(max),
    [Is_LUT] NVARCHAR(max),
    [PAN_Copy] NVARCHAR(max),
    [Address_Proof] NVARCHAR(max),
    [Incorporation_Certificate] NVARCHAR(max),
    [Critical_agreements_attached] NVARCHAR(max),
    [Aadhar_or_Udyogaadhar] NVARCHAR(max),
    [MOA_and_AOA_or_PS_Deed] NVARCHAR(max),
    [GST_registration_certificate] NVARCHAR(max),
    [Portal_user_1_in] NVARCHAR(max),
    [Portal_user_1_out] NVARCHAR(max),
    [Portal_user_2_in] NVARCHAR(max),
    [Portal_user_2_out] NVARCHAR(max),
    [Portal_user_3_in_] NVARCHAR(max),
    [Portal_user_3_out] NVARCHAR(max),
    [Portal_user_4_in] NVARCHAR(max),
    [Portal_user_4_out] NVARCHAR(max),
    [Portal_user_5_in] NVARCHAR(max),
    [Portal_user_5_out] NVARCHAR(max),
    [ID] NVARCHAR(max),
    [location] NVARCHAR(max),
    [poc1] NVARCHAR(max),
    [poc1Mobile] NVARCHAR(max),
    [poc2] NVARCHAR(max),
    [poc2Mobile] NVARCHAR(max),
    [subGroup] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[All_Projects] (
    [Project_ID] NVARCHAR(max),
    [UCR_Tag] NVARCHAR(max),
    [UCR_Subtag] NVARCHAR(max),
    [Completion_status] NVARCHAR(max),
    [Sub_Department] NVARCHAR(max),
    [Month__Plan] NVARCHAR(max),
    [Recurring_or_Non_Recuring] NVARCHAR(max),
    [Assignment_frequency] NVARCHAR(max),
    [Client_Name] NVARCHAR(max),
    [Group_name] NVARCHAR(max),
    [Entity] NVARCHAR(max),
    [Assignment_Nature__Technical] NVARCHAR(max),
    [Statutory_assignment] NVARCHAR(max),
    [Department] NVARCHAR(max),
    [Remarks] NVARCHAR(max),
    [isUDIN_applicable] NVARCHAR(max),
    [Primary_Person_handling] NVARCHAR(max),
    [Person_responsible__I] NVARCHAR(max),
    [Relevant_start_date] NVARCHAR(max),
    [Relevant_end_date] NVARCHAR(max),
    [Year] NVARCHAR(max),
    [Period] NVARCHAR(max),
    [EDOC_Year] NVARCHAR(max),
    [Invoiced_as_per_QB] NVARCHAR(max),
    [EDOC] NVARCHAR(max),
    [Estimate] NVARCHAR(max),
    [Final_amount] NVARCHAR(max),
    [Original_Budgeted_hours] NVARCHAR(max),
    [Revised_budgeted_hours] NVARCHAR(max),
    [Original_Estimated_hours] NVARCHAR(max),
    [Invoicing_remarks] NVARCHAR(max),
    [Is_GST_Nil_Return] NVARCHAR(max),
    [Manager_responsible] NVARCHAR(max),
    [Person_responsible__II] NVARCHAR(max),
    [Person_responsible__III] NVARCHAR(max),
    [REDOC] NVARCHAR(max),
    [Archival_date] NVARCHAR(max),
    [Invoice_date] NVARCHAR(max),
    [Completion_date] NVARCHAR(max),
    [Cancelled_Date] NVARCHAR(max),
    [Live_or_Cancelled] NVARCHAR(max),
    [Invoice_amount] NVARCHAR(max),
    [Project_stage] NVARCHAR(max),
    [Billing_status] NVARCHAR(max),
    [Project_UDIN] NVARCHAR(max),
    [Invoice_difference] NVARCHAR(max),
    [Archival_folder_name] NVARCHAR(max),
    [Archived_by] NVARCHAR(max),
    [UDIN_Updated] NVARCHAR(max),
    [is_Folder_updated] NVARCHAR(max),
    [Invoice_Year] NVARCHAR(max),
    [ID] NVARCHAR(max),
    [ROC_handled_by] NVARCHAR(max),
    [Reason_for_cancellation] NVARCHAR(max),
    [Assignment_Nature_replica] NVARCHAR(max),
    [Current_months_opening_percent] NVARCHAR(max),
    [Target__Current_month_] NVARCHAR(max),
    [Cumu_Completion_percent] NVARCHAR(max),
    [Current_month_progress2] NVARCHAR(max),
    [Base2_percent] NVARCHAR(max),
    [Firms2_percent] NVARCHAR(max),
    [Expected_Billing_month] NVARCHAR(max),
    [Plan__Week] NVARCHAR(max),
    [is_Spiral_bound_necessary] NVARCHAR(max),
    [Person_Responsible_1] NVARCHAR(max),
    [Person_Responsible_2] NVARCHAR(max),
    [Person_Responsible_3] NVARCHAR(max),
    [Due_Date] NVARCHAR(max),
    [Assignment_Nature__Invoice_display] NVARCHAR(max),
    [Assignment_Description] NVARCHAR(max),
    [Added_User] NVARCHAR(max),
    [Added_Time] NVARCHAR(max),
    [Modified_Time] NVARCHAR(max),
    [Modified_User] NVARCHAR(max),
    [Booked_hours] NVARCHAR(max),
    [Completion_EO_Month] NVARCHAR(max),
    [Original_plan_EO_month] NVARCHAR(max),
    [Execution_focus] NVARCHAR(max),
    [Completion_focus] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[allApps] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] VARCHAR(255),
    [appName] VARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__allApps__DE105D073BFF9D5F] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[allArguments] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255),
    [type] VARCHAR(255),
    [functionId] VARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__allArgum__DE105D076A915DA5] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ALLBUGS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [NAME] NVARCHAR(255),
    [BUG] NVARCHAR(255),
    [IMAGE] NVARCHAR(max),
    [EMAIL] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__ALLBUGS__C655572150FFA869] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[AllContracts] (
    [ClientName] VARCHAR(255),
    [entity] VARCHAR(max),
    [status] VARCHAR(max),
    [liveChurn] VARCHAR(max),
    [proposalStatus] VARCHAR(max),
    [termsConditions] VARCHAR(max),
    [addedUser] VARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [leadid] INT,
    [Attachments] NVARCHAR(max),
    [REMARKS] NVARCHAR(max),
    [userid] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [CONTRACTSTARTDATE] DATETIME2,
    [CONTRACTENDDATE] DATETIME2,
    [urn] VARCHAR(255),
    [contractID] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ALLCONTRACTS_FT_TEST] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [CLIENTNAME] NVARCHAR(255),
    [ENTITY] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [LIVECHURN] NVARCHAR(255),
    [PROPOSALSTATUS] NVARCHAR(255),
    [TERMSCONDITIONS] NVARCHAR(max),
    [REMARKS] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [contractstartdate] NVARCHAR(255),
    [contractenddate] NVARCHAR(255),
    CONSTRAINT [PK__ALLCONTR__C655572187465B76] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[AllDepartments] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [departmentName] NVARCHAR(max),
    [departmentHead] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__AllDepar__DE105D076829020F] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[allDimensions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userID] INT,
    [userName] NVARCHAR(255),
    [companyID] INT,
    [companyName] NVARCHAR(255),
    [dimension1] NVARCHAR(255),
    [dimension2] NVARCHAR(255),
    [dimension3] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATE,
    CONSTRAINT [PK__allDimen__DE105D07B07F7921] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AllEmployees] (
    [EmployeeCode] INT NOT NULL,
    [EmployeeName] VARCHAR(255),
    [Department] VARCHAR(255),
    [Designation] VARCHAR(255),
    [email] VARCHAR(255),
    CONSTRAINT [PK__AllEmplo__1F642549AA0DD22D] PRIMARY KEY CLUSTERED ([EmployeeCode])
);

-- CreateTable
CREATE TABLE [dbo].[allFields] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [columnName] VARCHAR(555),
    [columnType] VARCHAR(555),
    [tableDropdown] NVARCHAR(max),
    [tableName] VARCHAR(555),
    [buttonName] VARCHAR(555),
    [hideColumn] VARCHAR(555),
    [defaultValue] VARCHAR(555),
    [disableColumn] VARCHAR(255),
    [properties] NVARCHAR(max),
    [displayName] VARCHAR(255),
    CONSTRAINT [PK__allField__DE105D0756D1F5F9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AllFiles] (
    [clientName] VARCHAR(255) NOT NULL,
    [proposal] VARCHAR(255),
    CONSTRAINT [PK__AllFiles__F7B8CD44126C97D3] PRIMARY KEY CLUSTERED ([clientName])
);

-- CreateTable
CREATE TABLE [dbo].[allForms] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] NVARCHAR(255),
    [formName] VARCHAR(255),
    [displayName] VARCHAR(255),
    [appId] INT,
    [reportProperties] NVARCHAR(max),
    [formProperties] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__allForms__DE105D07AED64EC8] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AllInvoices] (
    [invoiceNumber] VARCHAR(255) NOT NULL,
    [projectCode] NVARCHAR(155),
    [amount] DECIMAL(18,0),
    [status] VARCHAR(255) NOT NULL,
    [assignmentNature] VARCHAR(max),
    [milestones] VARCHAR(max),
    [clientName] VARCHAR(max),
    [date] DATETIME2,
    [addedUser] VARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [assignmentID] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [edoc] DATETIME2,
    [invoiceGroupStatus] BIT CONSTRAINT [DF__AllInvoic__invoi__2D32A501] DEFAULT 0,
    [projectName] VARCHAR(455),
    [REMARKS] NVARCHAR(max),
    [contractID] NVARCHAR(255),
    CONSTRAINT [PK__AllInvoi__C72749EFB39BB303] PRIMARY KEY CLUSTERED ([invoiceNumber])
);

-- CreateTable
CREATE TABLE [dbo].[allLeaves] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [reason] VARCHAR(255),
    [fromDate] DATETIME2,
    [toDate] DATETIME2,
    [noOfDays] DECIMAL(12,2),
    [status] VARCHAR(255),
    [leaveManagementId] INT,
    [sampleTestId] INT,
    CONSTRAINT [PK__allLeave__DE105D07A24A2CB5] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[allModules] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [moduleName] NVARCHAR(255),
    [tableName] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [icon] NVARCHAR(max),
    CONSTRAINT [PK__allModul__DE105D07084388AE] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[allModuleTransactions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [moduleName] NVARCHAR(255),
    [tableName] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [mainTab] NVARCHAR(255),
    [subTab] NVARCHAR(255),
    [maintabSeq] INT,
    [subtagSeq] INT,
    [query] NVARCHAR(max),
    [moduleId] INT,
    [pyFnName] NVARCHAR(255),
    [section] VARCHAR(555),
    [sectionSeq] INT,
    CONSTRAINT [PK__allModul__DE105D07DB193DF9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AllObservations] (
    [ObservationCode] NVARCHAR(50) NOT NULL,
    [ProjectCode] NVARCHAR(155) NOT NULL,
    [ClientName] VARCHAR(255),
    [Caption] VARCHAR(255),
    [Comment] NVARCHAR(max),
    [AmountInvolved] FLOAT(53),
    [Impact] VARCHAR(255),
    [Recommendation] VARCHAR(255),
    [ClientResponse] VARCHAR(255),
    [IssueStatus] VARCHAR(255),
    [contractCode] VARCHAR(max),
    [assignedBy] VARCHAR(max),
    [personResponsible] VARCHAR(max),
    [personResponsible1] VARCHAR(255),
    [personResponsible2] VARCHAR(255),
    [personResponsible3] VARCHAR(255),
    [date] DATETIME2,
    [assignmentNature] NVARCHAR(max),
    [remarks] NVARCHAR(max),
    [pageId] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [type] NVARCHAR(255),
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [assignmentID] NVARCHAR(255),
    [managerResponsible] VARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [edoc] DATETIME2,
    [standardHours] FLOAT(53),
    [projectName] VARCHAR(455),
    [milestoneNumber] VARCHAR(255),
    [partner] NVARCHAR(255),
    [PROJECTREMARKS] NVARCHAR(max),
    [amountCovered] NVARCHAR(255),
    [completionDate] DATETIME2
);

-- CreateTable
CREATE TABLE [dbo].[allobservationsai] (
    [companyid] NVARCHAR(255),
    [observation] NVARCHAR(max),
    [caption] NVARCHAR(255),
    [amountcovered] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [type] NVARCHAR(255),
    [originalData] NVARCHAR(max),
    [currentperiod] NVARCHAR(255),
    [prevperiod] NVARCHAR(255),
    [tokensize] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[allOptions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [module] VARCHAR(555),
    [options] VARCHAR(555),
    [subModule] VARCHAR(555),
    CONSTRAINT [PK__allOptio__DE105D070592C066] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AllProjects] (
    [ProjectCode] NVARCHAR(155) NOT NULL,
    [ClientName] VARCHAR(255),
    [AssignmentNature] VARCHAR(255),
    [ProjectDescription] NVARCHAR(max),
    [Amount] FLOAT(53),
    [status] VARCHAR(max),
    [quarter] VARCHAR(max),
    [contractStatus] VARCHAR(max),
    [PersonResponsible1] NVARCHAR(max),
    [PersonResponsible2] NVARCHAR(max),
    [PersonResponsible3] NVARCHAR(max),
    [managerResponsible] NVARCHAR(max),
    [date] DATETIME2,
    [assignmentID] NVARCHAR(255),
    [addedUser] VARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [edoc] DATETIME2,
    [duration] NVARCHAR(max),
    [zbId] NVARCHAR(255),
    [partner] NVARCHAR(255),
    [REMARKS] NVARCHAR(max),
    [contractID] VARCHAR(255),
    [relevantStartDate] NVARCHAR(255),
    [relevantEndDate] NVARCHAR(255),
    [relevantYear] NVARCHAR(255),
    [assignmentNatureDisplay] NVARCHAR(255),
    [completionDate] DATETIME2,
    [liveOrCancelled] VARCHAR(255),
    [projectStatus] VARCHAR(255),
    [completionStatus] VARCHAR(255),
    [billingStatus] VARCHAR(255),
    [projectRemarks] NVARCHAR(max),
    [planDate] NVARCHAR(255),
    CONSTRAINT [PK_AllProjects] PRIMARY KEY CLUSTERED ([ProjectCode])
);

-- CreateTable
CREATE TABLE [dbo].[allPythonFunctions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(255),
    [url] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [frontEndHandle] VARCHAR(555),
    [type] VARCHAR(555),
    [localorcloud] VARCHAR(555),
    [category] VARCHAR(255),
    CONSTRAINT [PK__allPytho__DE105D07AE107289] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__allPytho__72E12F1BD07A660E] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [UQ__allPytho__DD778417AB5FB095] UNIQUE NONCLUSTERED ([url])
);

-- CreateTable
CREATE TABLE [dbo].[AllTimesheets] (
    [EmployeeName] VARCHAR(255),
    [ProjectCode] NVARCHAR(max),
    [ClientName] VARCHAR(255),
    [HoursWorked] FLOAT(53),
    [week] VARCHAR(max),
    [projectName] VARCHAR(max),
    [description] VARCHAR(max),
    [department] VARCHAR(max),
    [sunday] VARCHAR(max),
    [monday] VARCHAR(max),
    [tuesday] VARCHAR(max),
    [wednesday] VARCHAR(max),
    [thursday] VARCHAR(max),
    [friday] VARCHAR(max),
    [saturday] VARCHAR(max),
    [ID] VARCHAR(max),
    [rowTotal] VARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [Milestone] VARCHAR(255),
    [FROMDATE] NVARCHAR(10),
    [TODATE] NVARCHAR(10),
    [COMPANYID] NVARCHAR(55),
    [COMPANYNAME] NVARCHAR(55)
);

-- CreateTable
CREATE TABLE [dbo].[allWorkflows] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [tableName] VARCHAR(555),
    [fieldName] VARCHAR(555),
    [event] VARCHAR(555),
    [formula] NVARCHAR(255),
    [type] VARCHAR(255),
    [functions] VARCHAR(255),
    [workflowName] VARCHAR(255),
    CONSTRAINT [PK__allWorkf__DE105D07DC97DCBC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[amountLog] (
    [contractCode] INT NOT NULL,
    [clientName] VARCHAR(255),
    [amount] DECIMAL(18,0)
);

-- CreateTable
CREATE TABLE [dbo].[apilog] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [SYNCNAME] NVARCHAR(255),
    [SOURCESYSTEM] NVARCHAR(255),
    [DESTINATIONSYSTEM] NVARCHAR(255),
    [RUNTIME] NVARCHAR(255),
    [RESPONSETYPE] NVARCHAR(255),
    [RESPONSECODE] NVARCHAR(255),
    [RESPONSE] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[appAssets_form] (
    [lid] INT NOT NULL,
    [formName] NVARCHAR(255) NOT NULL,
    [formDisplay] NVARCHAR(max),
    [head] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__appAsset__DE105D072F6EE4C4] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__appAsset__B042776BD564814C] UNIQUE NONCLUSTERED ([formName])
);

-- CreateTable
CREATE TABLE [dbo].[appAssets_head] (
    [lid] INT NOT NULL,
    [headName] NVARCHAR(max),
    [headDisplay] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    CONSTRAINT [PK__appAsset__DE105D0784B4557A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[appAssets_report] (
    [lid] INT NOT NULL,
    [formID] INT,
    [reportName] NVARCHAR(255) NOT NULL,
    [reportDisplay] NVARCHAR(max),
    [head] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__appAsset__DE105D07567E0D1D] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__appAsset__1C0FB63CF4187DA1] UNIQUE NONCLUSTERED ([reportName])
);

-- CreateTable
CREATE TABLE [dbo].[appAssets_subHead] (
    [lid] INT NOT NULL,
    [headID] INT,
    [subHeadName] NVARCHAR(max),
    [subHeadDisplay] NVARCHAR(max),
    [head] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    CONSTRAINT [PK__appAsset__DE105D071F427C11] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AR_Collections] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [entity] NVARCHAR(max),
    [clientName] NVARCHAR(max),
    [dueDate] DATE,
    [collectedDate] DATE,
    [amount] DECIMAL(18,0),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    CONSTRAINT [PK__AR_Colle__DE105D07AB1DD5EA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AR_Manual] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [entity] NVARCHAR(max),
    [invoice_id] NVARCHAR(max),
    [zcrm_potential_id] NVARCHAR(max),
    [customer_id] NVARCHAR(max),
    [zcrm_potential_name] NVARCHAR(max),
    [customer_name] NVARCHAR(max),
    [company_name] NVARCHAR(max),
    [status] NVARCHAR(max),
    [invoice_number] NVARCHAR(max),
    [reference_number] NVARCHAR(max),
    [date] NVARCHAR(max),
    [due_date] NVARCHAR(max),
    [due_days] NVARCHAR(max),
    [email] NVARCHAR(max),
    [type] NVARCHAR(max),
    [project_name] NVARCHAR(max),
    [billing_address] NVARCHAR(max),
    [shipping_address] NVARCHAR(max),
    [country] NVARCHAR(max),
    [phone] NVARCHAR(max),
    [created_by] NVARCHAR(max),
    [total] NVARCHAR(max),
    [balance] NVARCHAR(max),
    [payment_expected_date] NVARCHAR(max),
    [custom_fields] NVARCHAR(max),
    [custom_field_hash] NVARCHAR(max),
    [cf_tag1] NVARCHAR(max),
    [cf_tag1_unformatted] NVARCHAR(max),
    [salesperson_name] NVARCHAR(max),
    [shipping_charge] NVARCHAR(max),
    [adjustment] NVARCHAR(max),
    [created_time] NVARCHAR(max),
    [last_modified_time] NVARCHAR(max),
    [updated_time] NVARCHAR(max),
    [is_viewed_by_client] NVARCHAR(max),
    [has_attachment] NVARCHAR(max),
    [client_viewed_time] NVARCHAR(max),
    [is_viewed_in_mail] NVARCHAR(max),
    [is_emailed] NVARCHAR(max),
    [mail_first_viewed_time] NVARCHAR(max),
    [mail_last_viewed_time] NVARCHAR(max),
    [color_code] NVARCHAR(max),
    [current_sub_status_id] NVARCHAR(max),
    [current_sub_status] NVARCHAR(max),
    [currency_id] NVARCHAR(max),
    [schedule_time] NVARCHAR(max),
    [currency_code] NVARCHAR(max),
    [currency_symbol] NVARCHAR(max),
    [is_pre_gst] NVARCHAR(max),
    [template_type] NVARCHAR(max),
    [no_of_copies] NVARCHAR(max),
    [show_no_of_copies] NVARCHAR(max),
    [invoice_url] NVARCHAR(max),
    [transaction_type] NVARCHAR(max),
    [hsn_or_sac] NVARCHAR(max),
    [reminders_sent] NVARCHAR(max),
    [last_reminder_sent_date] NVARCHAR(max),
    [last_payment_date] NVARCHAR(max),
    [template_id] NVARCHAR(max),
    [documents] NVARCHAR(max),
    [salesperson_id] NVARCHAR(max),
    [write_off_amount] NVARCHAR(max),
    [exchange_rate] NVARCHAR(max),
    [cf_commission] NVARCHAR(max),
    [cf_commission_unformatted] NVARCHAR(max),
    CONSTRAINT [PK__AR_Manua__DE105D07B645E9AA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AR_ReminderSettings] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [reminder] NVARCHAR(255),
    [day] INT,
    [messageContent] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__AR_Remin__DE105D07E0CEBBD9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AssignmentNature] (
    [assignmentNature] NVARCHAR(255),
    [statutoryAssignment] NVARCHAR(max),
    [relevantYearBlcok] NVARCHAR(max),
    [spiralBoundNecessary] NVARCHAR(max),
    [geography] NVARCHAR(max),
    [department] NVARCHAR(max),
    [subDepartment] NVARCHAR(max),
    [standardPrice] NVARCHAR(max),
    [type] NVARCHAR(max),
    [assignmentFrequency] NVARCHAR(max),
    [isUDIN_applicable] NVARCHAR(max),
    [ZCID] NVARCHAR(max),
    [multiplier] INT,
    [lid] INT NOT NULL IDENTITY(1,1),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(50),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(50),
    [classification] NVARCHAR(max),
    [checkpoints] NVARCHAR(max),
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    CONSTRAINT [pk_lid] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [an_add] UNIQUE NONCLUSTERED ([assignmentNature])
);

-- CreateTable
CREATE TABLE [dbo].[at] (
    [PLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [GROSSADVANCERECEIVED] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ata] (
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTH] NVARCHAR(255),
    [ORIGINALPLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [GROSSADVANCERECEIVED] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[atadj] (
    [PLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [GROSSADVANCEADJUSTED] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[atadja] (
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTH] NVARCHAR(255),
    [ORIGINALPLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [GROSSADVANCEADJUSTED] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ATHMABILLS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [BATCHNO] INT,
    [ADDEDTIME] DATETIME2,
    [ADDEDUSER] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] INT,
    [UHID] VARCHAR(555),
    [TOKENTIME] VARCHAR(555),
    [BILLDATE] VARCHAR(555),
    [BILLTIME] VARCHAR(555),
    [PATIENTNAME] VARCHAR(555),
    [BILLNO] VARCHAR(555),
    [OPNO] VARCHAR(555),
    [DOCTORCODE] VARCHAR(555),
    [DOCTORCOUNSELLOR] VARCHAR(555),
    [HEAD] VARCHAR(555),
    [TEST] VARCHAR(555),
    [SUBTEST] VARCHAR(555),
    [BILLAMOUNT] VARCHAR(555),
    [LINEAMOUNT] VARCHAR(555),
    [BILLEDBY] VARCHAR(555),
    [REFERREDBY] VARCHAR(555),
    [CONCESSION] VARCHAR(555),
    [LINEITEMCONCESSIN] VARCHAR(555),
    [SYNCTIMESTAMP] VARCHAR(555),
    [BILLTYPE] VARCHAR(555),
    CONSTRAINT [PK__ATHMABIL__C6555721A2994A5A] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[ATHMASETTLEMENT] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [BATCHNO] INT,
    [ADDEDTIME] DATETIME2,
    [ADDEDUSER] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] INT,
    [UHID] VARCHAR(555),
    [TOKENTIME] VARCHAR(555),
    [BILLDATE] VARCHAR(555),
    [BILLTIME] VARCHAR(555),
    [PATIENTNAME] VARCHAR(555),
    [BILLNO] VARCHAR(555),
    [OPNO] VARCHAR(555),
    [DOCTORCODE] VARCHAR(555),
    [DOCTORCOUNSELLOR] VARCHAR(555),
    [BILLAMOUNT] VARCHAR(555),
    [BILLEDBY] VARCHAR(555),
    [REFERREDBY] VARCHAR(555),
    [CONCESSION] VARCHAR(555),
    [SYNCTIMESTAMP] VARCHAR(555),
    [SETTLEMENTMODE] VARCHAR(555),
    [AMOUNTPAID] VARCHAR(555),
    [SETTLEMENTTIME] VARCHAR(555),
    [BILLTYPE] VARCHAR(555),
    CONSTRAINT [PK__ATHMASET__C65557215BD209B1] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[audit_checks] (
    [companyname] NVARCHAR(255),
    [date] NVARCHAR(255),
    [retPeriod] NVARCHAR(255),
    [ledgername] NVARCHAR(255),
    [voucherno] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [narration] NVARCHAR(max),
    [fy] NVARCHAR(255),
    [auditTag] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[auditDocs] (
    [lid] INT NOT NULL,
    [clientGroup] NVARCHAR(max),
    [clientName] NVARCHAR(max),
    [year] NVARCHAR(max),
    [document] NVARCHAR(max),
    [documentName] NVARCHAR(max),
    CONSTRAINT [PK__auditDoc__DE105D079825A75D] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[AuditorsInfoTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyID] INT,
    [companyName] NVARCHAR(max),
    [signingAuditorName] NVARCHAR(max),
    [firmName] NVARCHAR(max),
    [auditorMemberNumber] NVARCHAR(max),
    [firmRegNumber] NVARCHAR(max),
    [firmAddress] NVARCHAR(max),
    [firmWebsite] NVARCHAR(max),
    [firmPhoneNumber] NVARCHAR(max),
    CONSTRAINT [PK__Auditors__DE105D07D0670EBB] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[b2ba] (
    [GSTINUINOFRECIPIENT] NVARCHAR(255),
    [RECEIVERNAME] NVARCHAR(255),
    [ORIGINALINVOICENUMBER] NVARCHAR(255),
    [ORIGINALINVOICEDATE] NVARCHAR(255),
    [REVISEDINVOICENUMBER] NVARCHAR(255),
    [REVISEDINVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [INVOICETYPE] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[b2bsezde] (
    [GSTINUINOFRECIPIENT] NVARCHAR(255),
    [RECEIVERNAME] NVARCHAR(255),
    [INVOICENUMBER] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [INVOICETYPE] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[b2cl] (
    [INVOICENUMBER] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[b2cla] (
    [ORIGINALINVOICENUMBER] NVARCHAR(255),
    [ORIGINALINVOICEDATE] NVARCHAR(255),
    [ORIGINALPLACEOFSUPPLY] NVARCHAR(255),
    [REVISEDINVOICENUMBER] NVARCHAR(255),
    [REVISEDINVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[b2cs] (
    [TYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[b2csa] (
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTH] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [ECOMMERCEGSTIN] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[balanceSheet] (
    [lid] INT,
    [ALcategory] NVARCHAR(max),
    [Classification] NVARCHAR(max),
    [Head] NVARCHAR(max),
    [SubHead] NVARCHAR(max),
    [Sequence] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[bankDetails] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] NVARCHAR(255),
    [bankName] NVARCHAR(255),
    [accountNumber] NVARCHAR(255),
    [type] NVARCHAR(255),
    [ifscCode] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__bankDeta__DE105D07B4DE8456] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[bankMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [bankName] NVARCHAR(255),
    CONSTRAINT [PK__bankMast__DE105D07E9396400] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[bankStatement] (
    [TRANDATE] NVARCHAR(255),
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATAUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [reference] NVARCHAR(max),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[bankTransactions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] NVARCHAR(255),
    [bankName] NVARCHAR(255),
    [accountNumber] NVARCHAR(255),
    [batchNo] INT,
    [transactionDate] DATE,
    [settlementDate] DATE,
    [description] NVARCHAR(255),
    [debit] NVARCHAR(255),
    [credit] NVARCHAR(255),
    [balance] NVARCHAR(255),
    [tag1] NVARCHAR(255),
    [tag2] NVARCHAR(255),
    [tag3] NVARCHAR(255),
    [remarks] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__bankTran__DE105D07F0ACE6DE] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[baseTable] (
    [lid] INT NOT NULL,
    [bspl] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificationSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__baseTabl__DE105D077C2FC0DD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[BILLLINEITEMORIG] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [PARENTFORMID] NVARCHAR(255),
    [CHARTOFACCOUNTID] NVARCHAR(255),
    [CHARTOFACCOUNT] NVARCHAR(255),
    [ITEMID] NVARCHAR(255),
    [ITEMNAME] NVARCHAR(255),
    [ITEMDESCRIPTION] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [HSN] NVARCHAR(255),
    [UQC] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [LINEITEMDISCAMT] NVARCHAR(255),
    [LINEITEMDISCRATE] NVARCHAR(255),
    [IGST] NVARCHAR(255),
    [CGST] NVARCHAR(255),
    [SGST] NVARCHAR(255),
    [TOTALGST] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CURRENCY] NVARCHAR(255),
    [RATEINBC] NVARCHAR(255),
    [VALUEINBC] NVARCHAR(255),
    [VALUE] NVARCHAR(255),
    [IGSTINBC] NVARCHAR(255),
    [CGSTINBC] NVARCHAR(255),
    [SGSTINBC] NVARCHAR(255),
    [TOTALGSTINBC] NVARCHAR(255),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[BILLSORIG] (
    [ENTRYDATE] DATE,
    [LID] INT NOT NULL IDENTITY(1,1),
    [DOCUMENTDATE] DATE,
    [DOCUMENTDUEDATE] DATE,
    [DOCUMENTNUMBER] NVARCHAR(255),
    [VENDORGSTIN] NVARCHAR(255),
    [VENDORID] NVARCHAR(255),
    [VENDORNAME] NVARCHAR(255),
    [SOURCEOFSUPPLY] NVARCHAR(255),
    [BILLVALUE] DECIMAL(18,2),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [BEFOREDISCOUNT] DECIMAL(18,2),
    [DISCOUNT] DECIMAL(18,2),
    [TAXABLEVALUE] DECIMAL(18,2),
    [CESSAMOUNT] DECIMAL(18,2),
    [SUPPLYTYPE] NVARCHAR(255),
    [TAXNAME] NVARCHAR(255),
    [IGST] DECIMAL(18,2),
    [CGST] DECIMAL(18,2),
    [SGST] DECIMAL(18,2),
    [TOTALGST] DECIMAL(18,2),
    [TCS] DECIMAL(18,2),
    [LOCATION] NVARCHAR(255),
    [WAREHOUSE] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [DATASOURCEPROCESSNAME] NVARCHAR(255),
    [SLNO] NVARCHAR(255),
    [UNIQUEID] NVARCHAR(100) NOT NULL,
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [CREATEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [SOURCECREATOR] NVARCHAR(255),
    [SOURCEMODIFIER] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [RECOSTATUS] NVARCHAR(255),
    [BILLSTATUS] NVARCHAR(255),
    [NETRECEIVABLE] DECIMAL(18,2),
    [PAIDAMOUNT] DECIMAL(18,2),
    [OUTSTANDING] DECIMAL(18,2),
    [NOTES] NVARCHAR(255),
    [SOURCEREFID] NVARCHAR(255),
    [DESTREFID] NVARCHAR(255),
    [CATEGORY1] NVARCHAR(255),
    [CATEGORY2] NVARCHAR(255),
    [EDITLOG] NVARCHAR(max),
    [CURRENCY] NVARCHAR(255),
    [TAXABLEVALUEBC] DECIMAL(18,2),
    [CURRENCYRATE] DECIMAL(18,2),
    [BUDGETCODE] NVARCHAR(255),
    [PROJSTARTDATE] DATE,
    [PROJENDDATE] DATE,
    [PROJSTATUS] NVARCHAR(255),
    [BUDGET] DECIMAL(18,2),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255),
    [SOURCECREATETIME] NVARCHAR(255),
    [SOURCEMODIFTIME] NVARCHAR(255),
    [ISTRANACCEPTED] BIT,
    [CHARTOFACCOUNTID] NVARCHAR(255),
    [CHARTOFACCOUNT] NVARCHAR(255),
    [ITEMID] NVARCHAR(255),
    [ITEMNAME] NVARCHAR(255),
    [ITEMDESCRIPTION] NVARCHAR(255),
    [RATE] DECIMAL(18,2),
    [HSN] NVARCHAR(255),
    [UQC] NVARCHAR(255),
    [QUANTITY] DECIMAL(18,2),
    [LINEITEMDISCRATE] DECIMAL(18,2),
    [ISVALIDATED] BIT,
    [PROJECTID] NVARCHAR(255),
    [DOCULINEITEMID] INT,
    [ISREDFLAG] BIT
);

-- CreateTable
CREATE TABLE [dbo].[botDesignsGlobal] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [bot] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [syncFunctions] NVARCHAR(max),
    [category] NVARCHAR(255),
    [subCategory] NVARCHAR(255),
    [botStructure] NVARCHAR(max),
    CONSTRAINT [PK__botGloba__DE105D07E9FFAD27] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__botDesig__DE904127DFBFC1BA] UNIQUE NONCLUSTERED ([bot])
);

-- CreateTable
CREATE TABLE [dbo].[botTransactions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [bot] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [startDate] NVARCHAR(255),
    [endDate] NVARCHAR(255),
    [version] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [botStructure] NVARCHAR(max),
    CONSTRAINT [PK__botMaste__DE105D07550E5E51] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[branchLocation] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [clientId] VARCHAR(max),
    [clientName] VARCHAR(255),
    [location] VARCHAR(255),
    [Head] VARCHAR(255),
    [subHead] VARCHAR(255),
    [functionType] VARCHAR(max),
    [live] VARCHAR(max),
    [startDate] VARCHAR(max),
    [endDate] VARCHAR(max),
    CONSTRAINT [PK__branchLo__DE105D0787FC343E] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[branchMaster] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [BRANCHNAME] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__branchMa__DE105D077E394662] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[bulkimport] (
    [column1] NVARCHAR(max),
    [column2] NVARCHAR(max),
    [column3] NVARCHAR(max),
    [column4] NVARCHAR(max),
    [column5] NVARCHAR(max),
    [column6] NVARCHAR(max),
    [column7] NVARCHAR(max),
    [column8] NVARCHAR(max),
    [column9] NVARCHAR(max),
    [column10] NVARCHAR(max),
    [column11] NVARCHAR(max),
    [column12] NVARCHAR(max),
    [column13] NVARCHAR(max),
    [column14] NVARCHAR(max),
    [column15] NVARCHAR(max),
    [column16] NVARCHAR(max),
    [column17] NVARCHAR(max),
    [column18] NVARCHAR(max),
    [column19] NVARCHAR(max),
    [column20] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[calender] (
    [lid] INT NOT NULL,
    [date] DATE,
    [monthNo] INT,
    [base] INT,
    [prev] INT,
    [next] INT,
    [fy] VARCHAR(255),
    [fyQtr] VARCHAR(255),
    [cy] INT,
    [cyQtr] VARCHAR(255),
    [month] VARCHAR(255),
    [day] VARCHAR(255),
    [weekDay] INT,
    CONSTRAINT [PK__calender__DE105D07D3FA8AF3] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[Categories] (
    [CID] INT NOT NULL,
    [CategoryName] NVARCHAR(max),
    [Classification] NVARCHAR(max),
    CONSTRAINT [PK__Categori__C1F8DC59DD23EB95] PRIMARY KEY CLUSTERED ([CID])
);

-- CreateTable
CREATE TABLE [dbo].[cdnr] (
    [GSTINUINOFRECIPIENT] NVARCHAR(255),
    [RECEIVERNAME] NVARCHAR(255),
    [NOTENUMBER] NVARCHAR(255),
    [NOTEDATE] NVARCHAR(255),
    [NOTETYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [NOTESUPPLYTYPE] NVARCHAR(255),
    [NOTEVALUE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[cdnra] (
    [GSTINUINOFRECIPIENT] NVARCHAR(255),
    [RECEIVERNAME] NVARCHAR(255),
    [ORIGINALNOTENUMBER] NVARCHAR(255),
    [ORIGINALNOTEDATE] NVARCHAR(255),
    [REVISEDNOTENUMBER] NVARCHAR(255),
    [REVISEDNOTEDATE] NVARCHAR(255),
    [NOTETYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [NOTESUPPLYTYPE] NVARCHAR(255),
    [NOTEVALUE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[cdnur] (
    [URTYPE] NVARCHAR(255),
    [NOTENUMBER] NVARCHAR(255),
    [NOTEDATE] NVARCHAR(255),
    [NOTETYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [NOTEVALUE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[cdnura] (
    [URTYPE] NVARCHAR(255),
    [ORIGINALNOTENUMBER] NVARCHAR(255),
    [ORIGINALNOTEDATE] NVARCHAR(255),
    [REVISEDNOTENUMBER] NVARCHAR(255),
    [REVISEDNOTEDATE] NVARCHAR(255),
    [NOTETYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [NOTEVALUE] NVARCHAR(255),
    [APPLICABLETAXRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[chartReport] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [templateName] NVARCHAR(max),
    [companyName] NVARCHAR(max),
    [messageChat] NVARCHAR(max),
    [startYear] INT,
    [endYear] INT,
    [addedTime] DATETIME2,
    [image] NVARCHAR(max),
    [status] NVARCHAR(max),
    CONSTRAINT [PK__chartRep__DE105D07090E6203] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[client_Group] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [clientGroup] NVARCHAR(max),
    [subGroup] NVARCHAR(max),
    [client] NVARCHAR(max),
    [clientCode] NVARCHAR(max),
    [email] NVARCHAR(max),
    [poc1] NVARCHAR(max),
    [poc1Mobile] NVARCHAR(max),
    [poc2] NVARCHAR(max),
    [poc2Mobile] NVARCHAR(max),
    [regularMails] NVARCHAR(max),
    [escalationMails] NVARCHAR(max),
    [Address] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    CONSTRAINT [PK__client_G__DE105D07F2DBE522] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[clientGroup] (
    [lid] INT NOT NULL,
    [keyPerson1] NVARCHAR(max),
    [keyPerson2] NVARCHAR(max),
    [ZCID] NVARCHAR(max),
    [groupName] NVARCHAR(max),
    CONSTRAINT [PK__clientGr__DE105D07A4464CF6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ClientMaster] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [ClientName] VARCHAR(255) NOT NULL,
    [ClientCode] VARCHAR(255) NOT NULL,
    [Email] VARCHAR(255),
    [Mobile] VARCHAR(10),
    [ClientGroup] VARCHAR(255),
    [Status] VARCHAR(255),
    [toAddress] VARCHAR(max),
    [shippingAddress] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[clockTimer] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [clockIn] DATETIME2,
    [clockOut] DATETIME2,
    [duration] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [modifiedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedTime] DATETIME2,
    [status] NVARCHAR(255),
    CONSTRAINT [PK__clockTim__DE105D0718D903E2] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[coa_definition] (
    [LEDGER] NVARCHAR(255),
    [GROUPEDUNDER] NVARCHAR(255),
    [PRIMARYTAG] NVARCHAR(255),
    [SUPPLYTYPE] NVARCHAR(255),
    [GSTRCM] NVARCHAR(255),
    [COAGSTRATE] NVARCHAR(255),
    [CGSTSGSTIGST] NVARCHAR(255),
    [GSTNAME] NVARCHAR(255),
    [BRANCH] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [zohocoa] NVARCHAR(255),
    [zohodimension1] NVARCHAR(255),
    [zohodimension2] NVARCHAR(255),
    [zohodimension3] NVARCHAR(255),
    [zohodimension4] NVARCHAR(255),
    [MIG_OB] NVARCHAR(255),
    [MIG_DR_TRAN] NVARCHAR(255),
    [MIG_CR_TRAN] NVARCHAR(255),
    [MIG_CB] NVARCHAR(255),
    [ISTRANAVL] NVARCHAR(255),
    [PLBS] NVARCHAR(2),
    [gstin] NVARCHAR(255),
    [zohocontact] NVARCHAR(255),
    [zbid] NVARCHAR(255),
    [inputsource] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [coadescription] NVARCHAR(max),
    [dim3zbid] NVARCHAR(255),
    [dim4zbid] NVARCHAR(255),
    CONSTRAINT [PK_1451868239] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[COA_mapped] (
    [COMPANYID] NVARCHAR(255) NOT NULL,
    [COMPANYNAME] VARCHAR(255),
    [NAME] NVARCHAR(255) NOT NULL,
    [ADDRESS] NVARCHAR(max),
    [MAILINGNAME] VARCHAR(255),
    [LEDGERPHONE] VARCHAR(255),
    [LEDGERCONTACT] VARCHAR(255),
    [ISBILLWISEON] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [BILLALLOCATIONS] NVARCHAR(max),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [GSTIN] VARCHAR(255),
    [ggshCoa] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [LEDGERGROUP] VARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [tallyGroup] NVARCHAR(max),
    [tallySubGroup] NVARCHAR(max),
    [A] VARCHAR(255),
    [B] VARCHAR(255),
    [C] VARCHAR(255),
    [D] VARCHAR(255),
    [E] VARCHAR(255),
    [alieSeq] NVARCHAR(max),
    [classificationSeq] NVARCHAR(max),
    [headSeq] NVARCHAR(max),
    [subHeadSeq] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [UNIQUEFIELD] NVARCHAR(255),
    CONSTRAINT [uq_uniquefield] UNIQUE NONCLUSTERED ([UNIQUEFIELD])
);

-- CreateTable
CREATE TABLE [dbo].[COA_Mapping] (
    [RawCOAConcat] NVARCHAR(max),
    [Identifier] NVARCHAR(max),
    [Entity] NVARCHAR(max),
    [RawCOA] NVARCHAR(max),
    [entityCodeD] NVARCHAR(max),
    [entityNameD] NVARCHAR(max),
    [groupName] NVARCHAR(max),
    [ggshCoa] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [alie] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[coaEdit] (
    [coa] VARCHAR(255),
    [alie] VARCHAR(255),
    [bspl] VARCHAR(255),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [misCoa] NVARCHAR(max),
    [country] NVARCHAR(255),
    [entityType] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [formula] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[coaMapped_dataTransfer] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [ADDRESS] NVARCHAR(max),
    [MAILINGNAME] VARCHAR(255),
    [LEDGERPHONE] VARCHAR(255),
    [LEDGERCONTACT] VARCHAR(255),
    [ISBILLWISEON] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [BILLALLOCATIONS] NVARCHAR(max),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [GSTIN] VARCHAR(255),
    [ggshCoa] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [LEDGERGROUP] VARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [tallyGroup] NVARCHAR(max),
    [tallySubGroup] NVARCHAR(max),
    [A] VARCHAR(255),
    [B] VARCHAR(255),
    [C] VARCHAR(255),
    [D] VARCHAR(255),
    [E] VARCHAR(255),
    [alieSeq] NVARCHAR(max),
    [classificationSeq] NVARCHAR(max),
    [headSeq] NVARCHAR(max),
    [subHeadSeq] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE
);

-- CreateTable
CREATE TABLE [dbo].[coaMaster] (
    [coa] VARCHAR(255),
    [alie] VARCHAR(255),
    [bspl] VARCHAR(255),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [misCoa] NVARCHAR(max),
    [country] NVARCHAR(255),
    [entityType] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyName] NVARCHAR(255),
    [companyID] INT,
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2
);

-- CreateTable
CREATE TABLE [dbo].[coaMaster_edit] (
    [lid] INT NOT NULL,
    [coa] VARCHAR(255),
    [alie] VARCHAR(255),
    [bspl] VARCHAR(255),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [misCoa] NVARCHAR(max),
    [country] NVARCHAR(255),
    [entityType] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[coaNoDuplicates] (
    [name] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Commitment_reg] (
    [Geography_] VARCHAR(255),
    [Location_] VARCHAR(255),
    [Frequency] VARCHAR(255),
    [Tag] VARCHAR(255),
    [Fixed_variable] VARCHAR(255),
    [Transaction_type] VARCHAR(255),
    [Transaction_detail] VARCHAR(255),
    [Raw_COA] VARCHAR(255),
    [rate] DECIMAL(18,0),
    [times] DECIMAL(18,0),
    [Annual_amount] DECIMAL(18,0),
    [Monthly_amount] DECIMAL(18,0),
    [Remarks] VARCHAR(255),
    [Person_group] VARCHAR(255),
    [person_name] VARCHAR(255),
    [SpecificPeriod_OpenEnded] VARCHAR(255),
    [start_date] DATE,
    [end_date] DATE,
    [live_ended] VARCHAR(255),
    [Created_by] VARCHAR(255),
    [first_approval] VARCHAR(255),
    [final_approval] VARCHAR(255),
    [contract_attached] VARCHAR(255),
    [contract_proposal_attachment] VARBINARY(8000)
);

-- CreateTable
CREATE TABLE [dbo].[commitments] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyName] VARCHAR(max),
    [companyId] VARCHAR(255),
    [location] VARCHAR(255),
    [branch] VARCHAR(255),
    [frequency] VARCHAR(255),
    [expenseType] VARCHAR(255),
    [subCategory] VARCHAR(255),
    [rate] VARCHAR(255),
    [quantity] VARCHAR(255),
    [annual] VARCHAR(255),
    [perMonth] VARCHAR(255),
    [accountedIn] VARCHAR(255),
    [remarks] VARCHAR(255),
    [addedUser] VARCHAR(255),
    [addedTime] VARCHAR(255),
    [modifiedUser] VARCHAR(255),
    [modifiedTime] VARCHAR(255),
    [Head] VARCHAR(255),
    [subHead] VARCHAR(255),
    [functionType] VARCHAR(max),
    [live] VARCHAR(max),
    [startDate] VARCHAR(max),
    [endDate] VARCHAR(max),
    [description] VARCHAR(max),
    [ggshCoa] VARCHAR(max),
    [classification] VARCHAR(max),
    [alie] VARCHAR(max),
    [alieSeq] VARCHAR(max),
    [classificationSeq] VARCHAR(max),
    [headSeq] VARCHAR(max),
    [subHeadSeq] VARCHAR(max),
    [dimension1] NVARCHAR(255),
    [dimension2] NVARCHAR(255),
    [dimension3] NVARCHAR(255),
    [partyName] NVARCHAR(255),
    [valueRate] NVARCHAR(255),
    [fileUpload] NVARCHAR(max),
    [personResponsible] NVARCHAR(255),
    [timesaYear] NVARCHAR(255),
    [Segment] NVARCHAR(255),
    [status] VARCHAR(255),
    [natureOfExpense] VARCHAR(255),
    [commitmentNature] VARCHAR(255),
    [owner] VARCHAR(255),
    [RAWCOA] NVARCHAR(255),
    [financialYear] NVARCHAR(255),
    CONSTRAINT [PK__commitme__DE105D0746B7DE3F] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[companyAcBkMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyID] INT,
    [companyName] NVARCHAR(255),
    [booksSoftware] NVARCHAR(255),
    [fromDate] DATE,
    [toDate] DATE,
    [namePerSoftware] NVARCHAR(max),
    [uniqueOrgID] NVARCHAR(max),
    [clientID] NVARCHAR(max),
    [clientSecret] NVARCHAR(max),
    [authToken] NVARCHAR(max),
    [entityType] NVARCHAR(max),
    [scope] NVARCHAR(max),
    [refreshToken] NVARCHAR(max),
    [accessToken] NVARCHAR(max),
    [redirectURL] NVARCHAR(max),
    [isZohoBGServiceEnabled] NVARCHAR(max),
    [isActive] NVARCHAR(max),
    [financialStartDate] DATE,
    [addedTime] DATETIME2,
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    CONSTRAINT [PK__companyA__DE105D07B4524313] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[companyMaster] (
    [companyID] INT NOT NULL,
    [companyName] NVARCHAR(255) NOT NULL,
    [userID] INT,
    [userName] NVARCHAR(255),
    [emailID] NVARCHAR(255) NOT NULL,
    [groupID] INT,
    [consolidationID] INT,
    [pan] NVARCHAR(255),
    [itLogin] NVARCHAR(255),
    [itPassword] NVARCHAR(255),
    [country] NVARCHAR(255),
    [incorporationYear] NVARCHAR(255),
    [entityType] NVARCHAR(255),
    [dateFormat] NVARCHAR(255),
    [permanentAddress] NVARCHAR(255),
    [billingAddress] NVARCHAR(255),
    [logo] NVARCHAR(255),
    [signature] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [mobile] NVARCHAR(255),
    [financialStartDate] DATE,
    [letterHead] NVARCHAR(max),
    [CINLLPIN] NVARCHAR(55),
    CONSTRAINT [PK__companyM__AD5459B05528056A] PRIMARY KEY CLUSTERED ([companyID])
);

-- CreateTable
CREATE TABLE [dbo].[companyMasterData] (
    [COMPANYNAMEINMCA] NVARCHAR(255),
    [DATEOFINCORPORATION] NVARCHAR(255),
    [BUSINESSCATEGORY] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [AUTHORIZEDCAPITAL] NVARCHAR(255),
    [CIN] NVARCHAR(255),
    [LISTEDORNOT] NVARCHAR(255),
    [PAIDUPCAPITAL] NVARCHAR(255),
    [ADDRESS] NVARCHAR(255),
    [EMAIL] NVARCHAR(255),
    [DIRECTORSCOUNT] NVARCHAR(255),
    [DIRECTORSINFO] NVARCHAR(max),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[CompanyReportMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [template] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [companyName] NVARCHAR(max),
    [startYear] INT,
    [endYear] INT,
    [letterHead] NVARCHAR(max),
    [address] NVARCHAR(max),
    [UDIN] NVARCHAR(max),
    [directorsName] NVARCHAR(max),
    [shareHolders] NVARCHAR(max),
    CONSTRAINT [PK__CompanyR__DE105D07E0DD3F98] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[contactMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [entity] NVARCHAR(max),
    [source] NVARCHAR(max),
    [name] NVARCHAR(max),
    [groupName] NVARCHAR(max),
    [subGroup] NVARCHAR(max),
    [poc1] NVARCHAR(max),
    [poc1Mobile] NVARCHAR(max),
    [poc1Mail] NVARCHAR(max),
    [poc2] NVARCHAR(max),
    [poc2Mobile] NVARCHAR(max),
    [poc2Mail] NVARCHAR(max),
    [poc3] NVARCHAR(max),
    [poc3Mobile] NVARCHAR(max),
    [poc3Mail] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [companyid] NVARCHAR(max),
    [companyname] NVARCHAR(max),
    [type] NVARCHAR(255),
    [ANNUALBUSINESSVOLUME] NVARCHAR(255),
    CONSTRAINT [PK__contactM__DE105D073F700106] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ContractAssignmentNature] (
    [assignmentNature] VARCHAR(255),
    [sequence] INT,
    [type] VARCHAR(255),
    [frequency] VARCHAR(255),
    [feeEstimate] VARCHAR(255),
    [amount] VARCHAR(255),
    [dateFormat] VARCHAR(255),
    [relevantStartDate] DATETIME2,
    [relevantEndDate] DATETIME2,
    [relevantYear] VARCHAR(255),
    [contractStartDate] DATETIME2,
    [contractEndDate] DATETIME2,
    [quarter] VARCHAR(255),
    [managerResponsible] VARCHAR(255),
    [personResponsible1] VARCHAR(255),
    [personResponsible2] VARCHAR(255),
    [personResponsible3] VARCHAR(255),
    [edoc] DATETIME2,
    [dynamicEdoc] DATETIME2,
    [clientName] VARCHAR(255),
    [liveChurn] VARCHAR(255),
    [contractStatus] VARCHAR(255),
    [proposalStatus] VARCHAR(255),
    [entity] VARCHAR(255),
    [assignmentID] VARCHAR(255),
    [addedUser] VARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [partner] NVARCHAR(max),
    [REMARKS] NVARCHAR(max),
    [contractID] VARCHAR(255),
    [projectRemarks] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[CONTRACTASSIGNMENTNATURE_FT_TEST] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [ASSIGNMENTNATURE] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [FREQUENCY] NVARCHAR(255),
    [FEEESTIMATE] NVARCHAR(255),
    [AMOUNT] NVARCHAR(255),
    [DATEFORMAT] NVARCHAR(255),
    [RELEVANTSTARTDATE] NVARCHAR(255),
    [RELEVANTENDDATE] NVARCHAR(255),
    [RELEVANTYEAR] NVARCHAR(255),
    [CONTRACTSTARTDATE] NVARCHAR(255),
    [CONTRACTENDDATE] NVARCHAR(255),
    [QUARTER] NVARCHAR(255),
    [MANAGERRESPONSIBLE] NVARCHAR(255),
    [EDOC] NVARCHAR(255),
    [DYNAMICEDOC] NVARCHAR(255),
    [CLIENTNAME] NVARCHAR(255),
    [ENTITY] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [LIVECHURN] NVARCHAR(255),
    [PROPOSALSTATUS] NVARCHAR(255),
    [REMARKS] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [CONTRACTID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [partner] NVARCHAR(255),
    CONSTRAINT [PK__CONTRACT__C6555721BF683F49] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[countryMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [country] VARCHAR(max),
    [countryCode] VARCHAR(max),
    [addedUser] VARCHAR(max),
    [addedTime] VARCHAR(max),
    [modifiedTime] VARCHAR(max),
    [modifiedUser] VARCHAR(max),
    CONSTRAINT [PK__countryM__DE105D07700DB6DC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[courseMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [coursename] NVARCHAR(max),
    [coursecontent] NVARCHAR(max),
    [category] NVARCHAR(max),
    [summary] NVARCHAR(max),
    [courseDescription] NVARCHAR(max),
    [courseAuthor] NVARCHAR(max),
    [image] NVARCHAR(max),
    [video] NVARCHAR(max),
    [amount] INT,
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [videoThumbnail] NVARCHAR(max),
    [ThumbnailVideo] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [previewVideo] NVARCHAR(max),
    [pdfMaterial] NVARCHAR(max),
    [status] NVARCHAR(100),
    CONSTRAINT [PK__courseMa__DE105D07FCB0610B] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[courseVideoMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [coursename] NVARCHAR(max),
    [coursecontent] NVARCHAR(max),
    [thumbnailVideo] NVARCHAR(max),
    [summary] NVARCHAR(max),
    [video] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [status] NVARCHAR(100),
    CONSTRAINT [PK__courseVi__DE105D07522F82BC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[creditcard] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(255),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [reference] NVARCHAR(255),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT,
    CONSTRAINT [PK__creditca__C6555721E73EFE49] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[customerStatementExt] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATAUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [tags] NVARCHAR(255),
    [reference] NVARCHAR(max),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[DATAtRANSFER] (
    [COMPANYNAME] VARCHAR(255),
    [PARTICULARS] VARCHAR(255),
    [LEDGERGROUP] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [DEBIT] VARCHAR(255),
    [CREDIT] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [FROMDATE] VARCHAR(255),
    [TODATE] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [PERIOD] VARCHAR(255),
    [Dim1] VARCHAR(255),
    [Dim2] VARCHAR(255),
    [Dim3] VARCHAR(255),
    [actualOrBudget] VARCHAR(255),
    [coaOwner] VARCHAR(255),
    [adjustments] VARCHAR(255),
    [postAdjClBal] VARCHAR(255),
    [parentOrChildTb] VARCHAR(255),
    [LedgerCode] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1)
);

-- CreateTable
CREATE TABLE [dbo].[dayReport] (
    [employeeName] NVARCHAR(max),
    [createDate] NVARCHAR(max),
    [client] NVARCHAR(max),
    [class] NVARCHAR(max),
    [description] NVARCHAR(max),
    [department] NVARCHAR(max),
    [duration] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [activityDate] NVARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [week] DATETIME2,
    [projectName] NVARCHAR(255),
    [projectCode] NVARCHAR(255),
    [sheetId] INT,
    [Milestone] VARCHAR(255),
    [COMPANYNAME] NVARCHAR(55),
    [COMPANYID] NVARCHAR(55)
);

-- CreateTable
CREATE TABLE [dbo].[DB_Tally] (
    [Tran_date] DATE,
    [Ledger_name] VARCHAR(255),
    [Cost_centre] VARCHAR(255),
    [Tran_vouchertype] VARCHAR(255),
    [Tran_vouch_no] VARCHAR(255),
    [Net_amt] DECIMAL(18,0),
    [Narration] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[dbfData] (
    [REF_NO] NVARCHAR(100),
    [TRXN_NO] NVARCHAR(100),
    [PRODUCT] NVARCHAR(100),
    [UNITS] NVARCHAR(100),
    [RATE] NVARCHAR(100),
    [AMOUNT] NVARCHAR(100)
);

-- CreateTable
CREATE TABLE [dbo].[dcr] (
    [convertDate] NVARCHAR(255),
    [bookingDate] NVARCHAR(255),
    [trailId] NVARCHAR(255),
    [costId] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [pytCostBase] NVARCHAR(255),
    [bookingCostBase] NVARCHAR(255),
    [settlementCostBase] NVARCHAR(255),
    [pytCostInr] NVARCHAR(255),
    [bookingCostInr] NVARCHAR(255),
    [settlementCostInr] NVARCHAR(255),
    [pnr] NVARCHAR(255),
    [departureDate] NVARCHAR(255),
    [arrivalDate] NVARCHAR(255),
    [recoid] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [pytExRate] NVARCHAR(255),
    [bcExRate] NVARCHAR(255),
    [scExRate] NVARCHAR(255),
    [recotag] NVARCHAR(255),
    [recostatus] NVARCHAR(255),
    [booksid] NVARCHAR(255),
    CONSTRAINT [PK__dcr__DE105D07266F2728] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[definitionsTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [tableId] VARCHAR(555),
    [tableName] VARCHAR(555),
    [workflowName] VARCHAR(555),
    [definedData] VARCHAR(555),
    [jsonData] NVARCHAR(max),
    [FUNCTIONID] NVARCHAR(100),
    CONSTRAINT [PK__definiti__DE105D07642D51CD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[DIRECTORMCAMASTER] (
    [DIRECTORNAME] NVARCHAR(255),
    [DIN] NVARCHAR(55),
    [ENTITY] NVARCHAR(55),
    [ENTITYNAME] NVARCHAR(255),
    [CINLLPIN] NVARCHAR(55),
    [STARTDATE] NVARCHAR(55),
    [ENDDATE] NVARCHAR(55),
    [DESIGNATION] NVARCHAR(55),
    [SYNCTIMESTAMP] NVARCHAR(55)
);

-- CreateTable
CREATE TABLE [dbo].[docs] (
    [NATUREOFDOCUMENT] NVARCHAR(255),
    [SRNOFROM] NVARCHAR(255),
    [SRNOTO] NVARCHAR(255),
    [TOTALNUMBER] NVARCHAR(255),
    [CANCELLED] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[documentation] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [team] NVARCHAR(max),
    [role] NVARCHAR(max),
    [title] NVARCHAR(max),
    [upload] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [subCategory] VARCHAR(255),
    CONSTRAINT [PK__document__DE105D077A9A26B6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[dropdownMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [dropdownName] NVARCHAR(255),
    [options] NVARCHAR(max),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__dropdown__DE105D07593AE605] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[dueDates] (
    [COUNTRY] NVARCHAR(255),
    [STATUTE] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [FY] NVARCHAR(255),
    [STATE] NVARCHAR(255),
    [STATECODE] NVARCHAR(255),
    [RETURNNAME] NVARCHAR(255),
    [DUEDATE] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[DynamicTable] (
    [ID] INT NOT NULL,
    [LastName] VARCHAR(255) NOT NULL,
    [FirstName] VARCHAR(255),
    [Age] INT,
    CONSTRAINT [PK__DynamicT__3214EC27E1BB2B69] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[eco] (
    [NATUREOFSUPPLY] NVARCHAR(255),
    [GSTINOFECOMMERCEOPERATOR] NVARCHAR(255),
    [ECOMMERCEOPERATORNAME] NVARCHAR(255),
    [NETVALUEOFSUPPLIES] NVARCHAR(255),
    [INTEGRATEDTAX] NVARCHAR(255),
    [CENTRALTAXAMOUNT] NVARCHAR(255),
    [STATEUTTAX] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecoa] (
    [NATUREOFSUPPLY] NVARCHAR(255),
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTHQUARTER] NVARCHAR(255),
    [ORIGINALGSTINOFECOMMERCEOPERATOR] NVARCHAR(255),
    [REVISEDGSTINOFECOMMERCEOPERATOR] NVARCHAR(255),
    [ECOMMERCEOPERATORNAME] NVARCHAR(255),
    [REVISEDNETVALUEOFSUPPLIES] NVARCHAR(255),
    [INTEGRATEDTAX] NVARCHAR(255),
    [CENTRALTAXAMOUNT] NVARCHAR(255),
    [STATEUTTAX] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecoab2b] (
    [SUPPLIERGSTINUIN] NVARCHAR(255),
    [SUPPLIERNAME] NVARCHAR(255),
    [RECIPIENTGSTINUIN] NVARCHAR(255),
    [RECIPIENTNAME] NVARCHAR(255),
    [ORIGINALDOCUMENTNUMBER] NVARCHAR(255),
    [ORIGINALDOCUMENTDATE] NVARCHAR(255),
    [REVISEDDOCUMENTNUMBER] NVARCHAR(255),
    [REVISEDDOCUMENTDATE] NVARCHAR(255),
    [VALUEOFSUPPLIESMADE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [DOCUMENTTYPE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecoab2c] (
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTH] NVARCHAR(255),
    [SUPPLIERGSTINUIN] NVARCHAR(255),
    [SUPPLIERNAME] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecoaurp2b] (
    [RECIPIENTGSTINUIN] NVARCHAR(255),
    [RECIPIENTNAME] NVARCHAR(255),
    [ORIGINALDOCUMENTNUMBER] NVARCHAR(255),
    [ORIGINALDOCUMENTDATE] NVARCHAR(255),
    [REVISEDDOCUMENTNUMBER] NVARCHAR(255),
    [REVISEDDOCUMENTDATE] NVARCHAR(255),
    [VALUEOFSUPPLIESMADE] NVARCHAR(255),
    [DOCUMENTTYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecoaurp2c] (
    [FINANCIALYEAR] NVARCHAR(255),
    [ORIGINALMONTH] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecob2b] (
    [SUPPLIERGSTINUIN] NVARCHAR(255),
    [SUPPLIERNAME] NVARCHAR(255),
    [RECIPIENTGSTINUIN] NVARCHAR(255),
    [RECIPIENTNAME] NVARCHAR(255),
    [DOCUMENTNUMBER] NVARCHAR(255),
    [DOCUMENTDATE] NVARCHAR(255),
    [VALUEOFSUPPLIESMADE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [DOCUMENTTYPE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecob2c] (
    [SUPPLIERGSTINUIN] NVARCHAR(255),
    [SUPPLIERNAME] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecourp2b] (
    [RECIPIENTGSTINUIN] NVARCHAR(255),
    [RECIPIENTNAME] NVARCHAR(255),
    [DOCUMENTNUMBER] NVARCHAR(255),
    [DOCUMENTDATE] NVARCHAR(255),
    [VALUEOFSUPPLIESMADE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [DOCUMENTTYPE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ecourp2c] (
    [PLACEOFSUPPLY] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[EMPLOYEEMASTER] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [CREATEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [SOURCECREATOR] NVARCHAR(255),
    [SOURCEMODIFIER] NVARCHAR(255),
    [EMPLOYEEID] NVARCHAR(255),
    [EMPLOYEENAME] NVARCHAR(255),
    [OFFICIALEMAIL] NVARCHAR(255),
    [GENDER] NVARCHAR(255),
    [NATIONALITY] NVARCHAR(255),
    [DOB] NVARCHAR(255),
    [CATEGORY] NVARCHAR(255),
    [DEPARTMENT] NVARCHAR(255),
    [ENTITY] NVARCHAR(255),
    [DESIGNATION] NVARCHAR(255),
    [DOJ] NVARCHAR(255),
    [PROBATIONPERIOD] NVARCHAR(255),
    [DATEOFCONFIRMATION] NVARCHAR(255),
    [DATEOFEXIT] NVARCHAR(255),
    [REPORTINGTO] NVARCHAR(255),
    [BLOODGROUP] NVARCHAR(255),
    [CONTACTNUMBER] NVARCHAR(255),
    [ALTERNATECONTACTPERSON] NVARCHAR(255),
    [ALTERNATECONTACTNO] NVARCHAR(255),
    [CURRENTADDRESS] NVARCHAR(255),
    [PERMADDRESS] NVARCHAR(255),
    [PINCODE] NVARCHAR(255),
    [AADHARNO] NVARCHAR(255),
    [PAN] NVARCHAR(255),
    [EMPLOYMENTSTATUS] NVARCHAR(255),
    [BANKDETAILS] NVARCHAR(255),
    [DOCUMENTS] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[EMPLOYEEROLEMASTER] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [CREATEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [FUNCTIONNAME] NVARCHAR(255),
    [ROLENAME] NVARCHAR(255),
    [DESIGNATION] NVARCHAR(255),
    [MACRORESP] NVARCHAR(255),
    [ROLESANDRESP] NVARCHAR(255),
    [STANDARDKPI] NVARCHAR(255),
    [CTCLOW] NVARCHAR(255),
    [CTCHIGH] NVARCHAR(255),
    [MINTENURE] NVARCHAR(255),
    [MAXTENURE] NVARCHAR(255),
    [ENTRYREVENUE] NVARCHAR(255),
    [EXITREVENUE] NVARCHAR(255),
    [REMUNERATIONCOMPONENTS] NVARCHAR(255),
    [SKILLSDEFINITION] NVARCHAR(255),
    [QUALIFICATION] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Entries] (
    [EID] INT NOT NULL,
    [EntryName] NVARCHAR(max),
    [SCID] INT,
    [Total1] NVARCHAR(max),
    [Total2] NVARCHAR(max),
    CONSTRAINT [PK__Entries__C190170BB4B3023F] PRIMARY KEY CLUSTERED ([EID])
);

-- CreateTable
CREATE TABLE [dbo].[excelDocumentsUpload] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [category] NVARCHAR(max),
    [subCategory] NVARCHAR(max),
    [excelUpload] NVARCHAR(max),
    CONSTRAINT [PK__excelDoc__DE105D0762BAC8D7] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[exemp] (
    [DESCRIPTION] NVARCHAR(255),
    [NILRATEDSUPPLIES] NVARCHAR(255),
    [EXEMPTEDOTHERTHANNILRATEDNONGSTSUPPLY] NVARCHAR(255),
    [NONGSTSUPPLIES] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[exp] (
    [EXPORTTYPE] NVARCHAR(255),
    [INVOICENUMBER] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PORTCODE] NVARCHAR(255),
    [SHIPPINGBILLNUMBER] NVARCHAR(255),
    [SHIPPINGBILLDATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[expa] (
    [EXPORTTYPE] NVARCHAR(255),
    [ORIGINALINVOICENUMBER] NVARCHAR(255),
    [ORIGINALINVOICEDATE] NVARCHAR(255),
    [REVISEDINVOICENUMBER] NVARCHAR(255),
    [REVISEDINVOICEDATE] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PORTCODE] NVARCHAR(255),
    [SHIPPINGBILLNUMBER] NVARCHAR(255),
    [SHIPPINGBILLDATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[extDocsMaster] (
    [tabs] NVARCHAR(255),
    [tableName] NVARCHAR(255),
    [fields] NVARCHAR(max),
    [LID] INT NOT NULL IDENTITY(1,1),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    CONSTRAINT [PK__extDocsM__C65557213BC1B72A] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[extDocsSpecific] (
    [tabs] NVARCHAR(255),
    [tabName] NVARCHAR(255),
    [tableName] NVARCHAR(255),
    [fields] NVARCHAR(max),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    CONSTRAINT [PK__extDocsS__C65557215A505F7A] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[faClassification] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [classification] NVARCHAR(255),
    [subClassification] NVARCHAR(255),
    [lifeInYears] NVARCHAR(255),
    [scrapValue] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__faClassi__DE105D077874D0C6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[faReg] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [mainClassification] NVARCHAR(255),
    [subClassification] NVARCHAR(255),
    [assetID] NVARCHAR(255),
    [nameOfTheAsset] NVARCHAR(255),
    [capitalisationDate] NVARCHAR(255),
    [dateOfSale] NVARCHAR(255),
    [cost] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyId] VARCHAR(555),
    [companyName] VARCHAR(555),
    CONSTRAINT [PK__faReg__DE105D070E433954] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[faRegister] (
    [lid] INT NOT NULL,
    [sno] INT,
    [clientName] NVARCHAR(max),
    [assetCategory] NVARCHAR(max),
    [fsClassification] NVARCHAR(max),
    [description] NVARCHAR(max),
    [quantity] NVARCHAR(max),
    [rawCoa] NVARCHAR(max),
    [ggshCoa] NVARCHAR(max),
    [purchaseDate] DATE,
    [putToUseDate] DATE,
    [grossCost] NVARCHAR(max),
    [usefulLife] NVARCHAR(max),
    [rateOfDepreciation] NVARCHAR(max),
    [incometaxDepreciation] NVARCHAR(max),
    [residualValueRate] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    CONSTRAINT [PK__faRegist__DE105D072F6F2574] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[Finance] (
    [lid] INT NOT NULL,
    [financialTotal] NVARCHAR(max),
    [Note] NVARCHAR(max),
    [previousYear] NVARCHAR(max),
    CONSTRAINT [PK__Finance__DE105D07402E5F6B] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[FinanceBS] (
    [lid] INT NOT NULL,
    [allCategory] NVARCHAR(max),
    [Classification] NVARCHAR(max),
    [Head] NVARCHAR(max),
    [SubHead] NVARCHAR(max),
    [Sequence] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    CONSTRAINT [PK__FinanceB__DE105D07C61FA252] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[financial_templateMaster] (
    [tempId] INT NOT NULL IDENTITY(1,1),
    [templateName] NVARCHAR(max),
    [userName] NVARCHAR(max),
    CONSTRAINT [PK__financia__8A9E0BF5600AF28C] PRIMARY KEY CLUSTERED ([tempId])
);

-- CreateTable
CREATE TABLE [dbo].[FinancialSheet] (
    [lid] INT NOT NULL,
    [allCategory] NVARCHAR(max),
    [Classification] NVARCHAR(max),
    [Head] NVARCHAR(max),
    [SubHead] NVARCHAR(max),
    [Sequence] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [subPartition] NVARCHAR(max),
    [subCategory] NVARCHAR(max),
    [Total1] NVARCHAR(max),
    [Total2] NVARCHAR(max),
    CONSTRAINT [PK__Financia__DE105D072C5F534D] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[finChat] (
    [userID] INT,
    [emailID] NVARCHAR(255),
    [userName] NVARCHAR(255),
    [chatUrl] NVARCHAR(max),
    [addedUser] NVARCHAR(255),
    [addedTime] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[followupLog] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [poc] NVARCHAR(max),
    [balance] NVARCHAR(max),
    [dateOfCompletion] DATE,
    [modeOfContact] NVARCHAR(max),
    [remarks] NVARCHAR(max),
    [nextFollowup] DATE,
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    CONSTRAINT [PK__followup__DE105D073093B4BB] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[formName] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [name] VARCHAR(255),
    CONSTRAINT [PK__formName__DE105D07391B42E8] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ggshCoa] (
    [coa] VARCHAR(255),
    [alie] VARCHAR(255),
    [bspl] VARCHAR(255),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [misCoa] NVARCHAR(max),
    [country] NVARCHAR(255),
    [entityType] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyName] NVARCHAR(255),
    CONSTRAINT [PK__ggshCoa__DE105D0737F61ADD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ggshCoa_transactions] (
    [lid] INT NOT NULL,
    [coa] VARCHAR(255),
    [alie] VARCHAR(255),
    [bspl] VARCHAR(255),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [dc] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    [misCoa] NVARCHAR(max),
    [country] NVARCHAR(255),
    [entityType] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[GLOBALFORMS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [FORMNAME] NVARCHAR(255),
    [LINKNAME] NVARCHAR(255),
    [FORMJSON] NVARCHAR(max),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__GLOBALFO__C65557213D6FF3C7] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[globalModules] (
    [particulars] NVARCHAR(255),
    [name] NVARCHAR(255),
    [jsonData] NVARCHAR(max),
    [LID] INT NOT NULL IDENTITY(1,1),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    CONSTRAINT [PK__globalMo__C655572106426BC4] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[GlobalReportMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [template] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [category] VARCHAR(555),
    [subcategory] VARCHAR(555),
    [isMultiPerYear] VARCHAR(555),
    [documentID] INT,
    [reportType] NVARCHAR(max),
    [documentPath] NVARCHAR(max),
    [checkListName] NVARCHAR(max),
    CONSTRAINT [PK__GlobalRe__DE105D07FE3978A6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[goalSetting] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [entity] NVARCHAR(max),
    [year] NVARCHAR(max),
    [goal] NVARCHAR(max),
    [jan] NVARCHAR(max),
    [feb] NVARCHAR(max),
    [mar] NVARCHAR(max),
    [apr] NVARCHAR(max),
    [may] NVARCHAR(max),
    [jun] NVARCHAR(max),
    [jul] NVARCHAR(max),
    [aug] NVARCHAR(max),
    [sep] NVARCHAR(max),
    [oct] NVARCHAR(max),
    [nov] NVARCHAR(max),
    [dec] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [monthCode] NVARCHAR(max),
    CONSTRAINT [PK__goalSett__DE105D070A502B9C] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[gst_state_code_india] (
    [STATEORUTNAME] NVARCHAR(255) NOT NULL,
    [GSTCODE] NVARCHAR(2) NOT NULL,
    [SHORTFORM] NVARCHAR(2) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[gstinMaster] (
    [COMPANYNAME] NVARCHAR(255),
    [GSTIN] NVARCHAR(255),
    [GSTUSERNAME] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyid] INT,
    [gstAccessToken] NVARCHAR(500),
    [tokenSyncTime] NVARCHAR(255),
    CONSTRAINT [PK__gstinMas__DE105D07A201F302] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[GSTR_2A_Dump] (
    [Company_Name] VARCHAR(255),
    [Company_GSTIN] VARCHAR(255),
    [GSTIN_of_supplier] VARCHAR(255),
    [Trade_Legal_name_of_the_Supplier] VARCHAR(255),
    [Invoice_number] VARCHAR(255),
    [Invoice_type] VARCHAR(255),
    [Invoice_Date] VARCHAR(255),
    [Invoice_Value] VARCHAR(255),
    [Place_of_supply] VARCHAR(255),
    [Supply_Attract_Reverse_Charge] VARCHAR(255),
    [Rate] VARCHAR(255),
    [Taxable_Value] VARCHAR(255),
    [IGST] VARCHAR(255),
    [CGST] VARCHAR(255),
    [SGST] VARCHAR(255),
    [Cess] VARCHAR(255),
    [Counter_Party_Return_status] VARCHAR(255),
    [Month_of_GSTR_2A] VARCHAR(255),
    [unique_reference] VARCHAR(255),
    [Total_tax] VARCHAR(255),
    [revisedFinalTag] VARCHAR(max),
    [uiD_ManualMatch] VARCHAR(max),
    [reasonForIgnoring] VARCHAR(max),
    [action_required] VARCHAR(max),
    [revised_amt] VARCHAR(max),
    [systemID] VARCHAR(max),
    [Rev_Unique_key] VARCHAR(255),
    [Rev_date_of_trans] VARCHAR(255),
    [rev_Ref_1] VARCHAR(255),
    [rev_ref_2] VARCHAR(255),
    [rev_remarks] VARCHAR(255),
    [matching_ID] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[gstr1B2b] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [INVOICEVALUE] NVARCHAR(255),
    [INVOICETYPE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [INVOICENUMBER] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [TAXAMT] NVARCHAR(255),
    [TAXRATE] NVARCHAR(255),
    [CESSAMT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [COGSTIN] NVARCHAR(255),
    [CUSTOMERGSTIN] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [GSTRYEAR] NVARCHAR(255),
    [GSTRMONTH] NVARCHAR(255),
    [ORIGORAMEND] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME,
    CONSTRAINT [PK__gstr1B2b__C655572144B98F7B] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[GSTR1B2CS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(50),
    [COGSTIN] NVARCHAR(50),
    [GSTRYEAR] NVARCHAR(10),
    [GSTRMONTH] NVARCHAR(10),
    [PLACEOFSUPPLY] NVARCHAR(50),
    [TAXABLEVALUE] NVARCHAR(50),
    [RATE] NVARCHAR(50),
    [CGST] NVARCHAR(50),
    [SGST] NVARCHAR(50),
    [IGST] NVARCHAR(50),
    [CESS] NVARCHAR(50),
    [TAXAMT] NVARCHAR(50),
    [INVOICEVALUE] NVARCHAR(50),
    [SUPPLYTYPE] NVARCHAR(50),
    [RETURNFORM] NVARCHAR(50),
    [ADDEDUSER] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    CONSTRAINT [PK__GSTR1B2C__C65557210B447F32] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[gstr1Portal] (
    [invoiceVal] NVARCHAR(255),
    [rate] NVARCHAR(255),
    [taxablevalue] NVARCHAR(255),
    [invDate] NVARCHAR(255),
    [InvNum] NVARCHAR(255),
    [customerGstin] NVARCHAR(255),
    [gstin] NVARCHAR(255),
    [cgst] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[gstr2b] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [INVDATE] NVARCHAR(255),
    [INVVALUE] NVARCHAR(255),
    [INVNO] NVARCHAR(255),
    [TAXABLEVAL] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [SGST] NVARCHAR(255),
    [CGST] NVARCHAR(255),
    [IGST] NVARCHAR(255),
    [SUPPLIERNAME] NVARCHAR(255),
    [DATEOFFILING] NVARCHAR(255),
    [SUPPLIERPERIOD] NVARCHAR(255),
    [GSTIN] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [GSTR2BYEAR] NVARCHAR(255),
    [GSTR2BMONTH] NVARCHAR(255),
    [SYNCDATETIME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [COMPANYGSTIN] NVARCHAR(15),
    CONSTRAINT [PK__gstr2b__C6555721D084BAD4] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[gstr3b] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [GSTIN] NVARCHAR(15),
    [YEAR] NVARCHAR(255),
    [RETPERIOD] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [SUBTYPE] NVARCHAR(255),
    [TRN_TYPE] NVARCHAR(255),
    [REF] NVARCHAR(255),
    [TOTALOUTWARDSUPPLY] NVARCHAR(255),
    [TOTALRCMSUPPLY] NVARCHAR(255),
    [TOTALINWARDSUPPLY] NVARCHAR(255),
    [SGST] NVARCHAR(255),
    [CGST] NVARCHAR(255),
    [IGST] NVARCHAR(255),
    [TOTALTAX] NVARCHAR(255),
    [SGSTINT] NVARCHAR(255),
    [CGSTINT] NVARCHAR(255),
    [IGSTINT] NVARCHAR(255),
    [TOTALINT] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [MONTH] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[hsn] (
    [HSN] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(255),
    [UQC] NVARCHAR(255),
    [TOTALQUANTITY] NVARCHAR(255),
    [TOTALVALUE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [INTEGRATEDTAXAMOUNT] NVARCHAR(255),
    [CENTRALTAXAMOUNT] NVARCHAR(255),
    [STATEUTTAXAMOUNT] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [RETURNMONTH] NVARCHAR(255),
    [RETURNYEAR] NVARCHAR(255),
    [DATEOFRETURN] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[importTest] (
    [id] INT,
    [age] INT,
    [ref1] VARCHAR(255),
    [ref2] VARCHAR(255),
    [amount] DECIMAL(18,0),
    [remarks] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[injectTest] (
    [name] NVARCHAR(255),
    [age] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Input_BOA_Dump] (
    [Company_Name] VARCHAR(255),
    [Company_GSTIN] VARCHAR(255),
    [GSTIN_of_supplier] VARCHAR(255),
    [Trade_Legal_name_of_the_Supplier] VARCHAR(255),
    [Invoice_number] VARCHAR(255),
    [Voucher_Type] VARCHAR(255),
    [Invoice_Date] VARCHAR(255),
    [Voucher_Ref] VARCHAR(255),
    [Invoice_type] VARCHAR(255),
    [Invoice_Value] VARCHAR(255),
    [Input_Input_service] VARCHAR(255),
    [Nature_of_expense] VARCHAR(255),
    [Rate] VARCHAR(255),
    [Taxable_Value] VARCHAR(255),
    [IGST] VARCHAR(255),
    [CGST] VARCHAR(255),
    [SGST] VARCHAR(255),
    [Cess] VARCHAR(255),
    [Total_Tax] VARCHAR(255),
    [unique_reference] VARCHAR(255),
    [revisedFinalTag] VARCHAR(max),
    [uiD_ManualMatch] VARCHAR(max),
    [reasonForIgnoring] VARCHAR(max),
    [action_required] VARCHAR(max),
    [revised_amt] VARCHAR(max),
    [systemID] VARCHAR(max),
    [Rev_Unique_key] VARCHAR(255),
    [Rev_date_of_trans] VARCHAR(255),
    [rev_Ref_1] VARCHAR(255),
    [rev_ref_2] VARCHAR(255),
    [rev_remarks] VARCHAR(255),
    [matching_ID] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[interview] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [candidateName] NVARCHAR(255),
    [mobileNumber] NVARCHAR(255),
    [email] NVARCHAR(255),
    [status] NVARCHAR(255),
    [position] NVARCHAR(255),
    [location] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyid] INT,
    [companyname] NVARCHAR(255),
    [userid] INT,
    CONSTRAINT [PK__intervie__DE105D07C5C7BCC7] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[INVITEDUSERS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [INVITEDUSERID] NVARCHAR(255),
    [INVITEDUSEREMAIL] NVARCHAR(255),
    [ROLE] NVARCHAR(255),
    [MODULES] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [STATUS] NVARCHAR(255),
    CONSTRAINT [PK__INVITEDU__C65557214DAB328B] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[invoice_outstanding] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [company_name] NVARCHAR(max),
    [customer_id] NVARCHAR(max),
    [invoice_number] NVARCHAR(max),
    [invoice_id] NVARCHAR(max),
    [invoice_url] NVARCHAR(max),
    [date] DATE,
    [due_date] DATE,
    [total] NVARCHAR(max),
    [balance] NVARCHAR(max),
    [entity] NVARCHAR(max),
    [upcomingDate] DATE,
    CONSTRAINT [PK__invoice___DE105D073D19E2BF] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[invoiceDescription] (
    [invoice_id] NVARCHAR(255),
    [description] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [entity] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[INVOICELINEITEMORIG] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [PARENTFORMID] NVARCHAR(255),
    [CHARTOFACCOUNTID] NVARCHAR(255),
    [CHARTOFACCOUNT] NVARCHAR(255),
    [ITEMID] NVARCHAR(255),
    [ITEMNAME] NVARCHAR(255),
    [ITEMDESCRIPTION] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [HSN] NVARCHAR(255),
    [UQC] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [LINEITEMDISCAMT] NVARCHAR(255),
    [LINEITEMDISCRATE] NVARCHAR(255),
    [IGST] NVARCHAR(255),
    [CGST] NVARCHAR(255),
    [SGST] NVARCHAR(255),
    [TOTALGST] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CURRENCY] NVARCHAR(255),
    [RATEINBC] NVARCHAR(255),
    [VALUEINBC] NVARCHAR(255),
    [VALUE] NVARCHAR(255),
    [IGSTINBC] NVARCHAR(255),
    [CGSTINBC] NVARCHAR(255),
    [SGSTINBC] NVARCHAR(255),
    [TOTALGSTINBC] NVARCHAR(255),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [addedtime] DATETIME2,
    [userid] INT
);

-- CreateTable
CREATE TABLE [dbo].[INVOICESORIG] (
    [ENTRYDATE] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [DOCUMENTDATE] NVARCHAR(255),
    [DOCUMENTDUEDATE] NVARCHAR(255),
    [DOCUMENTNUMBER] NVARCHAR(255),
    [CUSTOMERGSTIN] NVARCHAR(255),
    [CUSTOMERID] NVARCHAR(255),
    [CUSTOMERNAME] NVARCHAR(255),
    [SOURCEOFSUPPLY] NVARCHAR(255),
    [INVOICEVALUE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [BEFOREDISCOUNT] NVARCHAR(255),
    [DISCOUNT] NVARCHAR(255),
    [TAXABLEVALUE] NVARCHAR(255),
    [CESSAMOUNT] NVARCHAR(255),
    [SUPPLYTYPE] NVARCHAR(255),
    [TAXNAME] NVARCHAR(255),
    [IGST] NVARCHAR(255),
    [CGST] NVARCHAR(255),
    [SGST] NVARCHAR(255),
    [TOTALGST] NVARCHAR(255),
    [TCS] NVARCHAR(255),
    [LOCATION] NVARCHAR(255),
    [WAREHOUSE] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [DATASOURCEPROCESSNAME] NVARCHAR(255),
    [SLNO] NVARCHAR(255),
    [UNIQUEID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [SOURCECREATOR] NVARCHAR(255),
    [SOURCEMODIFIER] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [RECOSTATUS] NVARCHAR(255),
    [INVOICESTATUS] NVARCHAR(255),
    [NETRECEIVABLE] NVARCHAR(255),
    [PAIDAMOUNT] NVARCHAR(255),
    [OUTSTANDING] NVARCHAR(255),
    [NOTES] NVARCHAR(255),
    [SOURCEREFID] NVARCHAR(255),
    [DESTREFID] NVARCHAR(255),
    [CATEGORY1] NVARCHAR(255),
    [CATEGORY2] NVARCHAR(255),
    [EDITLOG] NVARCHAR(max),
    [CURRENCY] NVARCHAR(255),
    [TAXABLEVALUEBC] NVARCHAR(255),
    [CURRENCYRATE] NVARCHAR(255),
    [BUDGETCODE] NVARCHAR(255),
    [PROJSTARTDATE] NVARCHAR(255),
    [PROJENDDATE] NVARCHAR(255),
    [PROJSTATUS] NVARCHAR(255),
    [BUDGET] NVARCHAR(255),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255),
    [SOURCECREATETIME] NVARCHAR(255),
    [SOURCEMODIFTIME] NVARCHAR(255),
    [ISTRANACCEPTED] NVARCHAR(255),
    [EXTDOCUMENTNUMBER] NVARCHAR(255),
    [userid] INT
);

-- CreateTable
CREATE TABLE [dbo].[itcLedger] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYGSTIN] NVARCHAR(255),
    [RETURNPERIOD] NVARCHAR(255),
    [TRANDATE] NVARCHAR(255),
    [REFNO] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(255),
    [TRANTYPE] NVARCHAR(255),
    [SGSTBAL] NVARCHAR(255),
    [CGSTBAL] NVARCHAR(255),
    [IGSTBAL] NVARCHAR(255),
    [CESSBAL] NVARCHAR(255),
    [TOTALBAL] NVARCHAR(255),
    [SGSTAMT] NVARCHAR(255),
    [CGSTAMT] NVARCHAR(255),
    [IGSTAMT] NVARCHAR(255),
    [CESSAMT] NVARCHAR(255),
    [TOTALTRAMT] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [FROMDATE] NVARCHAR(255),
    [TODATE] NVARCHAR(255),
    [OB] NVARCHAR(255),
    [CB] NVARCHAR(255),
    CONSTRAINT [PK__itcLedge__C6555721397ED9D8] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[jk] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [undefined] NVARCHAR(max),
    CONSTRAINT [PK__jk__DE105D07A8B928A3] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[kpimaster] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [DIMENSION] NVARCHAR(255),
    [FUNCTIONDEP] NVARCHAR(255),
    [THEME] NVARCHAR(255),
    [GOALS] NVARCHAR(255),
    [KPI] NVARCHAR(255),
    [SUBKPI] NVARCHAR(255),
    [WEIGHTAGE] NVARCHAR(255),
    [MEASURE] NVARCHAR(255),
    [STANDARD] NVARCHAR(255),
    [FORMULA] NVARCHAR(255),
    [PURPOSE] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [STANDARDGOAL] NVARCHAR(255),
    [ANNUALDELTA] NVARCHAR(255),
    [MODE] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[KPITRANSACTION] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [DIMENSION] NVARCHAR(255),
    [FUNCTIONDEP] NVARCHAR(255),
    [THEME] NVARCHAR(255),
    [GOALS] NVARCHAR(255),
    [KPI] NVARCHAR(255),
    [SUBKPI] NVARCHAR(255),
    [WEIGHTAGE] NVARCHAR(255),
    [MEASURE] NVARCHAR(255),
    [STANDARD] NVARCHAR(255),
    [FORMULA] NVARCHAR(255),
    [PURPOSE] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [JAN] NVARCHAR(255),
    [FEB] NVARCHAR(255),
    [MAR] NVARCHAR(255),
    [APR] NVARCHAR(255),
    [MAY] NVARCHAR(255),
    [JUN] NVARCHAR(255),
    [JUL] NVARCHAR(255),
    [AUG] NVARCHAR(255),
    [SEP] NVARCHAR(255),
    [OCT] NVARCHAR(255),
    [NOV] NVARCHAR(255),
    [DEC] NVARCHAR(255),
    [ACTUALTOTAL] NVARCHAR(255),
    [GOAL] NVARCHAR(255),
    [MODE] NVARCHAR(255),
    [GOALYTD] NVARCHAR(255),
    [PERCENTACHIEVED] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[landingLogin] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(max),
    [password] NVARCHAR(max),
    [companyName] NVARCHAR(max),
    [email] NVARCHAR(max),
    [Mobile] NVARCHAR(max),
    [gstNumber] NVARCHAR(max),
    [country] NVARCHAR(max),
    [jobPosition] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [type] VARCHAR(255),
    [planType] NVARCHAR(max),
    [message] NVARCHAR(max),
    CONSTRAINT [PK__landingL__DE105D075DBB9FB8] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[LEADMANAGEMENT] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [PROSPECTNAME] NVARCHAR(255),
    [EMAILID] NVARCHAR(255),
    [MOBILENUMBER] NVARCHAR(255),
    [PROSPECTBUSINESSNAME] NVARCHAR(255),
    [LEADSOURCE] NVARCHAR(255),
    [REQUIREMENT] NVARCHAR(255),
    [ANNUALBUSINESSVOLUME] NVARCHAR(255),
    [NUMBEROFEMPLOYEES] NVARCHAR(255),
    [ISQUALIFIED] NVARCHAR(255),
    [LEADHEAT] NVARCHAR(255),
    [ISOPEN] NVARCHAR(255),
    [REMARKS] NVARCHAR(255),
    [LEADDATE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [LEADSTATUS] NVARCHAR(255),
    [CLOSEDATE] NVARCHAR(255),
    [PROPOSALNUMBER] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [ADDEDTIME] DATETIME2,
    [LEADTYPE] NVARCHAR(55),
    [PRIMARYPERSONHANDLING] NVARCHAR(55),
    [LEADNATURE] NVARCHAR(55),
    [ESTIMATE] NVARCHAR(55),
    [FINAL] NVARCHAR(55),
    [ACV] NVARCHAR(55),
    [BRIGADE] NVARCHAR(55),
    [DATEOFPROPOSAL] NVARCHAR(55),
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [CLIENTNAME] NVARCHAR(max),
    [ENTITY] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[leadwf] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [leadId] INT,
    [mobileNumber] INT,
    [email] VARCHAR(555),
    [leadSource] VARCHAR(555),
    [leadStatus] VARCHAR(555),
    [leadOpenDays] VARCHAR(555),
    CONSTRAINT [PK__leadwf__DE105D074BDC86EF] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[leaveManagement] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [name] VARCHAR(255),
    [department] VARCHAR(255),
    CONSTRAINT [PK__leaveMan__DE105D07EB9A8ECC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[leaveRequest] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyname] NVARCHAR(255),
    [companyid] INT,
    [userid] INT,
    [requestDate] DATE,
    [leaveType] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [fromDate] DATE,
    [toDate] DATE,
    [reason] NVARCHAR(500),
    [workPlan] NVARCHAR(500),
    [approver] NVARCHAR(255),
    [copyTo] NVARCHAR(500),
    [rejectionReason] NVARCHAR(500),
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [status] NVARCHAR(255),
    [requestor] NVARCHAR(255),
    CONSTRAINT [PK__leaveReq__DE105D078EB2A5E3] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[liveinvoiceslist] (
    [COMPANYID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [INVOICEJSON] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[loanTakenStatement] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATAUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [tags] NVARCHAR(255),
    [reference] NVARCHAR(max),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[loanTransactions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] NVARCHAR(255),
    [bankName] NVARCHAR(255),
    [accountNumber] NVARCHAR(255),
    [batchNo] INT,
    [transactionDate] DATE,
    [settlementDate] DATE,
    [description] NVARCHAR(255),
    [debit] NVARCHAR(255),
    [credit] NVARCHAR(255),
    [balance] NVARCHAR(255),
    [tag1] NVARCHAR(255),
    [tag2] NVARCHAR(255),
    [tag3] NVARCHAR(255),
    [remarks] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[LV1_trans_test] (
    [EntityName_D] NVARCHAR(max),
    [Entity_Code_D] NVARCHAR(max),
    [Date_Entry] NVARCHAR(max),
    [RawCOA_x] NVARCHAR(max),
    [VoucherType] NVARCHAR(max),
    [VoucherNo] NVARCHAR(max),
    [Narration_for_transaction] NVARCHAR(max),
    [Debit] NVARCHAR(max),
    [Credit] NVARCHAR(max),
    [Net] NVARCHAR(max),
    [TrtoCOAMapping] NVARCHAR(max),
    [RawCOAConcat] NVARCHAR(max),
    [Month_no] NVARCHAR(max),
    [Base] NVARCHAR(max),
    [Prev] NVARCHAR(max),
    [Next] NVARCHAR(max),
    [FY] NVARCHAR(max),
    [FY_Qtr] NVARCHAR(max),
    [CY] NVARCHAR(max),
    [CY_Qtr] NVARCHAR(max),
    [Month] NVARCHAR(max),
    [Identifier] NVARCHAR(max),
    [Entity] NVARCHAR(max),
    [RawCOA_y] NVARCHAR(max),
    [entityCodeD] NVARCHAR(max),
    [entityNameD] NVARCHAR(max),
    [groupName] NVARCHAR(max),
    [ggshCoa] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [alie] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[mailTemplates] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [templatename] NVARCHAR(255),
    [mailcontent] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [subject] NVARCHAR(555),
    CONSTRAINT [PK__mailTemp__C65557211AB522AA] PRIMARY KEY CLUSTERED ([LID]),
    CONSTRAINT [UQ__mailTemp__1C959F06ADE17E04] UNIQUE NONCLUSTERED ([templatename])
);

-- CreateTable
CREATE TABLE [dbo].[marks] (
    [lid] INT NOT NULL,
    [name] NVARCHAR(max),
    [subject] NVARCHAR(max),
    [marks] NVARCHAR(max),
    [year] NVARCHAR(max),
    CONSTRAINT [PK__marks__DE105D075450F4F7] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[MasterRawDB] (
    [LineItemID_RDB_D] INT NOT NULL IDENTITY(1,1),
    [EntityCode_D] NVARCHAR(max),
    [EntityName_D] NVARCHAR(max),
    [CompanyName_S] NVARCHAR(max),
    [OrganisationID_S] NVARCHAR(max),
    [TransactionID_S] NVARCHAR(max),
    [SubTransaction_ID_S] NVARCHAR(max),
    [LineItemID_S] NVARCHAR(max),
    [TransactionID_D] NVARCHAR(max),
    [SubTransaction_ID_D] NVARCHAR(max),
    [DeviceID] NVARCHAR(max),
    [Date_Entry] NVARCHAR(max),
    [Date_document] NVARCHAR(max),
    [COA_code_S] NVARCHAR(max),
    [RawCOA] NVARCHAR(max),
    [TableName_S] NVARCHAR(max),
    [VoucherType] NVARCHAR(max),
    [VoucherNo] NVARCHAR(max),
    [Narration_for_transaction] NVARCHAR(max),
    [Lineitem_description] NVARCHAR(max),
    [Notes] NVARCHAR(max),
    [CostCentre] NVARCHAR(max),
    [Debit] NVARCHAR(max),
    [Credit] NVARCHAR(max),
    [Net] NVARCHAR(max),
    [SourceSystem] NVARCHAR(max),
    [Created_Timestamp_S] NVARCHAR(max),
    [Modified_Timestamp_S] NVARCHAR(max),
    [Createdby_user_S] NVARCHAR(max),
    [Editedby_user_S] NVARCHAR(max),
    [Source_transaction_status] NVARCHAR(max),
    [Createdby_user_D] NVARCHAR(max),
    [Editedby_user_D] NVARCHAR(max),
    [Record_created_timestamp_D] NVARCHAR(max),
    [clientID] VARCHAR(255),
    [DBID] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[Milestones] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [assignmentNature] NVARCHAR(max),
    [milestones] NVARCHAR(max),
    [milestoneNumber] INT,
    [assignmentNatureID] INT,
    [COMPANYNAME] NVARCHAR(55),
    [COMPANYID] NVARCHAR(55),
    [BUDGETEDHOURS] NVARCHAR(10),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(50),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(50),
    CONSTRAINT [PK__Mileston__DE105D07246B62F6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[milestoneSubform] (
    [sequence] INT,
    [milestoneNumber] INT,
    [milestone] VARCHAR(255),
    [paymentPercent] DECIMAL(18,2),
    [amount] DECIMAL(18,2),
    [advance] VARCHAR(255),
    [assignmentID] VARCHAR(255),
    [completionPercentage] NVARCHAR(255),
    [status] NVARCHAR(255),
    [addedUser] VARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] VARCHAR(255),
    [modifiedTime] DATETIME2,
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [standardHours] FLOAT(53),
    [AssignmentNature] VARCHAR(255),
    [milestoneId] VARCHAR(255),
    [contractID] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[MILESTONESUBFORM_FT_TEST] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [ASSIGNMENTNATURE] NVARCHAR(255),
    [SEQUENCE] NVARCHAR(255),
    [MILESTONENUMBER] NVARCHAR(255),
    [MILESTONE] NVARCHAR(255),
    [PAYMENTPERCENT] NVARCHAR(255),
    [AMOUNT] NVARCHAR(255),
    [ADVANCE] NVARCHAR(255),
    [COMPLETIONPERCENTAGE] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [STANDARDHOURS] NVARCHAR(255),
    [ASSIGNMENTID] NVARCHAR(255),
    [CONTRACTID] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    CONSTRAINT [PK__MILESTON__C65557214A0F7817] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[myworks] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(max),
    [task] NVARCHAR(max),
    [status] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [contractID] NVARCHAR(255),
    [assignmentID] NVARCHAR(255),
    [observationCode] NVARCHAR(50),
    [assignedBy] NVARCHAR(255),
    [assignedTime] DATE,
    [completedBy] NVARCHAR(255),
    [completedTime] DATE,
    [expectedCompletedTime] DATE,
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [projectCode] VARCHAR(100),
    [milestoneId] NVARCHAR(555),
    [subtask] NVARCHAR(555)
);

-- CreateTable
CREATE TABLE [dbo].[negotiateLog] (
    [contractCode] INT,
    [clientName] VARCHAR(255),
    [amount] DECIMAL(18,0),
    [edoc] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[newTest] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test] VARCHAR(555),
    CONSTRAINT [PK__newTest__DE105D07C1BF65FE] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[newTestDemo] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [employeeName] VARCHAR(555),
    [employeeId] VARCHAR(555),
    [department] VARCHAR(555),
    [dateOfJoining] DATETIME2,
    [salary] DECIMAL(12,2),
    CONSTRAINT [PK__newTestD__DE105D0784480203] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[observations] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [issue] NVARCHAR(500),
    [status] NVARCHAR(200),
    [attachment] NVARCHAR(max),
    [assigneeComment] NVARCHAR(max),
    [assignerComment] NVARCHAR(max),
    [companyId] INT,
    [companyName] NVARCHAR(200),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(200),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(200),
    CONSTRAINT [PK__observat__DE105D07242D8890] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[pagebuilder_form] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [formName] NVARCHAR(max),
    [displayName] NVARCHAR(max),
    [linkName] NVARCHAR(max),
    [type] NVARCHAR(max),
    CONSTRAINT [PK__pagebuil__DE105D070697E9F5] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[PARENTFORMTEMPLATE] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [TOTALVALUE] NVARCHAR(255),
    [TRANSACTIONDATE] NVARCHAR(255),
    [VENDORNAME] NVARCHAR(255),
    [LOOKUP] NVARCHAR(255),
    [DROPDOWN] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [ADDEDUSER] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [USERID] NVARCHAR(255),
    [checkboxtest] NVARCHAR(255),
    [radiotest] NVARCHAR(255),
    CONSTRAINT [PK__PARENTFO__C65557213AEC1647] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[paymentgateway] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATAUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [tags] NVARCHAR(255),
    [reference] NVARCHAR(max),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[planTable] (
    [planscheme] NVARCHAR(max),
    [Amount] NVARCHAR(max),
    [Validity] NVARCHAR(max),
    [Addedtime] NVARCHAR(max),
    [Addeduser] NVARCHAR(max),
    [userName] NVARCHAR(max),
    [userID] INT,
    [modeofPayment] NVARCHAR(max),
    [paymentDate] DATETIME2,
    [expirationDate] DATETIME2,
    [timePeriod] NVARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [emailID] NVARCHAR(max),
    [status] NVARCHAR(max),
    CONSTRAINT [PK__planTabl__DE105D079D8617B6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ProcessedDB] (
    [DATE] NVARCHAR(max),
    [VOUCHERTYPENAME] NVARCHAR(max),
    [VOUCHERNUMBER] NVARCHAR(max),
    [VOUCHERKEY] NVARCHAR(max),
    [LEDGERNAME] NVARCHAR(max),
    [ACCOUNTINGALLOCATIONSAMOUNT] NVARCHAR(max),
    [NARRATION] NVARCHAR(max),
    [COSTCENTRE] NVARCHAR(max),
    [COMPANYID] NVARCHAR(max),
    [COMPANYNAME] NVARCHAR(max),
    [DeviceUUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [SYNCTIMESTAMP] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[proposal_editLog] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [edoc] DATETIME2,
    [amount] INT,
    [contractId] INT,
    [assignmentNature] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [isAmountSame] NVARCHAR(255),
    [isEdocSame] NVARCHAR(255),
    CONSTRAINT [PK__proposal__DE105D07344FB1F2] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[proposal_templateTransactions] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [template] NVARCHAR(max),
    [chatHistory] NVARCHAR(max),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [contractID] VARCHAR(255),
    CONSTRAINT [PK__proposal__DE105D076926B200] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[proposalBlob] (
    [lid] INT NOT NULL,
    [contractId] INT,
    [HTMLBlob] NVARCHAR(max),
    [addedUser] VARCHAR(255),
    [addedTime] VARCHAR(255),
    [modifiedUser] VARCHAR(255),
    [modifiedTime] VARCHAR(255),
    CONSTRAINT [PK__proposal__DE105D070E0E6D9D] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__proposal__DE105D067076AA08] UNIQUE NONCLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[questionTemplate] (
    [lid] INT NOT NULL,
    [Category] NVARCHAR(max),
    [Question] NVARCHAR(max),
    [Answer] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__question__DE105D0731323FBD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[questionTransaction] (
    [lid] INT NOT NULL,
    [clientName] NVARCHAR(max),
    [Category] NVARCHAR(max),
    [Question] NVARCHAR(max),
    [Answer] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__question__DE105D071398E6CA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[Raw_ContactMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(255),
    [entity] NVARCHAR(255),
    [source] NVARCHAR(255),
    [groupName] NVARCHAR(255),
    [subGroup] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    CONSTRAINT [PK__Raw_Cont__DE105D075D0B9E4E] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[RECEIPTSORIG] (
    [ENTRYDATE] DATE,
    [LID] NVARCHAR(255),
    [DOCUMENTDATE] DATE,
    [DOCUMENTNUMBER] NVARCHAR(255),
    [AGAINSTDOCNO] NVARCHAR(255),
    [AGAINSTDOCDATE] DATE,
    [PARTYGSTIN] NVARCHAR(255),
    [PARTYID] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [DOCUMENTVALUE] DECIMAL(18,2),
    [DOCUMENTVALUEINBC] DECIMAL(18,2),
    [TCS] DECIMAL(18,2),
    [LOCATION] NVARCHAR(255),
    [WAREHOUSE] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [DATASOURCEPROCESSNAME] NVARCHAR(255),
    [SLNO] NVARCHAR(255),
    [UNIQUEID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [CREATEDTIME] DATETIME,
    [MODIFIEDTIME] DATETIME,
    [SOURCECREATOR] NVARCHAR(255),
    [SOURCEMODIFIER] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [RECOSTATUS] NVARCHAR(255),
    [DOCUMENTSTATUS] NVARCHAR(255),
    [NOTES] NVARCHAR(255),
    [SOURCEREFID] NVARCHAR(255),
    [DESTREFID] NVARCHAR(255),
    [CATEGORY1] NVARCHAR(255),
    [CATEGORY2] NVARCHAR(255),
    [EDITLOG] NVARCHAR(255),
    [CURRENCY] NVARCHAR(255),
    [CURRENCYRATE] NVARCHAR(255),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255),
    [SOURCECREATETIME] DATETIME,
    [SOURCEMODIFTIME] DATETIME,
    [ISVALIDATED] BIT,
    [ISREDFLAG] BIT,
    [COA] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[RecoTableA] (
    [Tablesource] VARCHAR(50),
    [Unique_key] VARCHAR(50),
    [Date_of_trans] VARCHAR(50),
    [Ref_1] VARCHAR(50),
    [Ref_2] VARCHAR(50),
    [Amount] DECIMAL(18,0),
    [Remarks] VARCHAR(255),
    [revisedFinalTag] VARCHAR(max),
    [uiD_ManualMatch] VARCHAR(max),
    [reasonForIgnoring] VARCHAR(max),
    [action_required] VARCHAR(max),
    [revised_amt] VARCHAR(max),
    [systemID] VARCHAR(max),
    [Rev_Unique_key] VARCHAR(255),
    [Rev_date_of_trans] VARCHAR(255),
    [rev_Ref_1] VARCHAR(255),
    [rev_ref_2] VARCHAR(255),
    [rev_remarks] VARCHAR(255),
    [matching_ID] VARCHAR(255),
    [UserID] INT
);

-- CreateTable
CREATE TABLE [dbo].[RecoTableB] (
    [Tablesource] VARCHAR(50),
    [Unique_key] VARCHAR(50),
    [Date_of_trans] VARCHAR(50),
    [Ref_1] VARCHAR(50),
    [Ref_2] VARCHAR(50),
    [Amount] DECIMAL(18,0),
    [Remarks] VARCHAR(255),
    [revisedFinalTag] VARCHAR(max),
    [uiD_ManualMatch] VARCHAR(max),
    [reasonForIgnoring] VARCHAR(max),
    [action_required] VARCHAR(max),
    [revised_amt] VARCHAR(max),
    [systemID] VARCHAR(max),
    [Rev_Unique_key] VARCHAR(255),
    [Rev_date_of_trans] VARCHAR(255),
    [rev_Ref_1] VARCHAR(255),
    [rev_ref_2] VARCHAR(255),
    [rev_remarks] VARCHAR(255),
    [matching_ID] VARCHAR(255),
    [UserID] INT
);

-- CreateTable
CREATE TABLE [dbo].[reportsList] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [reportName] VARCHAR(555),
    [reportCategory] VARCHAR(555),
    [pyFunction] VARCHAR(255),
    CONSTRAINT [PK__reportsL__DE105D0721A2FB56] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[requirements] (
    [lid] INT NOT NULL,
    [clientName] NVARCHAR(max),
    [description] NVARCHAR(max),
    [attachment] NVARCHAR(max),
    [comment] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    CONSTRAINT [PK__requirem__DE105D076F1639DD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [pagePermission] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [modules] NVARCHAR(2000),
    [emailid] NVARCHAR(999),
    [userid] INT,
    [role] NVARCHAR(255),
    [companyId] INT
);

-- CreateTable
CREATE TABLE [dbo].[SALEORDERORIG] (
    [ENTRYDATE] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [DOCUMENTDATE] DATE,
    [DOCUMENTDUEDATE] DATE,
    [DOCUMENTNUMBER] NVARCHAR(255),
    [PARTYGSTIN] NVARCHAR(255),
    [PARTYID] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [SOURCEOFSUPPLY] NVARCHAR(255),
    [DOCUMENTVALUE] DECIMAL(18,2),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [REVERSECHARGE] NVARCHAR(255),
    [BEFOREDISCOUNT] DECIMAL(18,2),
    [DISCOUNT] DECIMAL(18,2),
    [TAXABLEVALUE] DECIMAL(18,2),
    [CESSAMOUNT] NVARCHAR(255),
    [SUPPLYTYPE] NVARCHAR(255),
    [TAXNAME] NVARCHAR(255),
    [IGST] DECIMAL(18,2),
    [CGST] DECIMAL(18,2),
    [SGST] DECIMAL(18,2),
    [TOTALGST] DECIMAL(18,2),
    [TCS] DECIMAL(18,2),
    [LOCATION] NVARCHAR(255),
    [WAREHOUSE] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [DATASOURCEPROCESSNAME] NVARCHAR(255),
    [SLNO] NVARCHAR(255),
    [UNIQUEID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    [CREATEDTIME] DATETIME,
    [MODIFIEDTIME] DATETIME,
    [SOURCECREATOR] NVARCHAR(255),
    [SOURCEMODIFIER] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [RECOSTATUS] NVARCHAR(255),
    [DOCUMENTSTATUS] NVARCHAR(255),
    [NETRECEIVABLE] NVARCHAR(255),
    [PAIDAMOUNT] DECIMAL(18,2),
    [OUTSTANDING] DECIMAL(18,2),
    [NOTES] NVARCHAR(255),
    [SOURCEREFID] NVARCHAR(255),
    [DESTREFID] NVARCHAR(255),
    [CATEGORY1] NVARCHAR(255),
    [CATEGORY2] NVARCHAR(255),
    [EDITLOG] NVARCHAR(max),
    [CURRENCY] NVARCHAR(255),
    [TAXABLEVALUEBC] DECIMAL(18,2),
    [CURRENCYRATE] DECIMAL(18,2),
    [BUDGETCODE] NVARCHAR(255),
    [PROJSTARTDATE] DATE,
    [PROJENDDATE] DATE,
    [PROJSTATUS] NVARCHAR(255),
    [BUDGET] DECIMAL(18,2),
    [TAG1] NVARCHAR(255),
    [TAG2] NVARCHAR(255),
    [SOURCECREATETIME] DATETIME,
    [SOURCEMODIFTIME] DATETIME,
    [ISTRANACCEPTED] NVARCHAR(255),
    [AGENCYTRNGROSS] NVARCHAR(255),
    [AGENCYCOST] NVARCHAR(255),
    [ISAGENCY] NVARCHAR(255),
    [EXTDOCUMENTNUMBER] NVARCHAR(255),
    [ISAPIEDITABLE] NVARCHAR(255),
    [ISVALIDATED] BIT,
    [ISREDFLAG] BIT
);

-- CreateTable
CREATE TABLE [dbo].[sales_table] (
    [SaleDate] DATE,
    [CustomerName] VARCHAR(255),
    [Industry] VARCHAR(255),
    [Geography_] VARCHAR(255),
    [Location_] VARCHAR(255),
    [ProductCode] VARCHAR(255),
    [ProductCategory] VARCHAR(255),
    [ProductSubCategory] VARCHAR(255),
    [ProductName] VARCHAR(255),
    [B2B_B2C] VARCHAR(255),
    [LC_FC] VARCHAR(255),
    [CurrencyCountry] VARCHAR(255),
    [HSN_SAC] VARCHAR(255),
    [UOM] VARCHAR(255),
    [Quantity] DECIMAL(18,0),
    [Rate] DECIMAL(18,0),
    [MRP] DECIMAL(18,0),
    [GSTRate] DECIMAL(18,0),
    [TaxableValue] DECIMAL(18,0),
    [DiscountRate] DECIMAL(18,0),
    [discountAmt] DECIMAL(18,0),
    [GSTAmount] DECIMAL(18,0),
    [InvoiceValue] DECIMAL(18,0),
    [Particulars] VARCHAR(255),
    [taxablevalue_fc] DECIMAL(18,0),
    [PlaceOfSupply] VARCHAR(255),
    [NatureOfSupply] VARCHAR(255),
    [EWayBillNo] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[salesAISource] (
    [invoiceID] NVARCHAR(max),
    [branch] NVARCHAR(max),
    [city] NVARCHAR(max),
    [customerType] NVARCHAR(max),
    [gender] NVARCHAR(max),
    [productLine] NVARCHAR(max),
    [unitPrice] DECIMAL(18,0),
    [quantity] DECIMAL(18,0),
    [tax] DECIMAL(18,0),
    [total] DECIMAL(18,0),
    [date] DATE,
    [payment] NVARCHAR(max),
    [grossIncome] DECIMAL(18,0),
    [rating] DECIMAL(18,0)
);

-- CreateTable
CREATE TABLE [dbo].[sample] (
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test1] NVARCHAR(max),
    [test2] NVARCHAR(max),
    [test3] NVARCHAR(max),
    [test4] NVARCHAR(max),
    [test5] NVARCHAR(max),
    [test6] NVARCHAR(max),
    [test7] DATETIME2,
    [batchNo] INT,
    [amount] INT,
    [test123] NVARCHAR(max),
    [userid] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK_1202819347] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[sample1] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test] NVARCHAR(max),
    [date] DATETIME2,
    [amount] INT,
    [text] VARCHAR(555),
    CONSTRAINT [PK__sample1__DE105D07DF5C8F2F] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[scheduleDemo] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(255),
    [email] NVARCHAR(max),
    [phone] NVARCHAR(255),
    [companyStrength] NVARCHAR(255),
    [isIndia] NVARCHAR(255),
    [reference] NVARCHAR(255),
    [privacyNotice] NVARCHAR(255),
    [scheduleDate] DATETIME2,
    [scheduleTime] DATETIME2,
    CONSTRAINT [PK__schedule__DE105D07EA215F38] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[SEC206ABCHECK] (
    [PAN] NVARCHAR(10),
    [PANNAME] NVARCHAR(55),
    [ISSPECIFIEDPERSON] NVARCHAR(1),
    [PANSTATUS] NVARCHAR(55),
    [FINANCIALYEAR] NVARCHAR(55),
    [SYNCTIMESTAMP] NVARCHAR(55)
);

-- CreateTable
CREATE TABLE [dbo].[segmentcriteria] (
    [companyId] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [segmentCriteriaName] NVARCHAR(255),
    [writeup] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[segmentMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [segmentcriteria] NVARCHAR(255),
    [segmentName] NVARCHAR(255),
    [personresponsible] NVARCHAR(255),
    CONSTRAINT [PK__segmentM__DE105D07E9199C27] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[sepTest] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test] VARCHAR(555),
    [test1] VARCHAR(255),
    [test2] VARCHAR(255),
    [test3] DATETIME2,
    [test4] NVARCHAR(255),
    [test5] VARCHAR(555),
    [testttt] VARCHAR(555),
    [test7] VARCHAR(555),
    CONSTRAINT [PK__sepTest__DE105D0702B5E953] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[SimpleReco_Pyt] (
    [Tablesource] VARCHAR(max),
    [Unique_key] VARCHAR(max),
    [Date_of_trans] VARCHAR(max),
    [Ref_1] VARCHAR(max),
    [Ref_2] VARCHAR(max),
    [Amount] FLOAT(53),
    [Remarks] VARCHAR(max),
    [revisedFinalTag] VARCHAR(max),
    [uiD_ManualMatch] VARCHAR(max),
    [reasonForIgnoring] VARCHAR(max),
    [action_required] VARCHAR(max),
    [revised_amt] VARCHAR(max),
    [systemID] VARCHAR(max),
    [Rev_Unique_key] VARCHAR(max),
    [Rev_date_of_trans] VARCHAR(max),
    [rev_Ref_1] VARCHAR(max),
    [rev_ref_2] VARCHAR(max),
    [rev_remarks] VARCHAR(max),
    [matching_ID] VARCHAR(max),
    [ContraAmt] FLOAT(53),
    [cond_1] VARCHAR(max),
    [cond_1_a] VARCHAR(max),
    [cond_2] VARCHAR(max),
    [cond_2a] VARCHAR(max),
    [cond_3] VARCHAR(max),
    [cond_3A] VARCHAR(max),
    [cond_4] VARCHAR(max),
    [cond_4A] VARCHAR(max),
    [cond_5] VARCHAR(max),
    [cond_5A] VARCHAR(max),
    [cond_6] VARCHAR(max),
    [cond_6A] VARCHAR(max),
    [cond_7] VARCHAR(max),
    [cond_7A] VARCHAR(max),
    [cond_8] VARCHAR(max),
    [cond_8A] VARCHAR(max),
    [cond_9] VARCHAR(max),
    [count_1] BIGINT,
    [count_1_a] BIGINT,
    [count_2] BIGINT,
    [count_2_a] BIGINT,
    [count_3] BIGINT,
    [count_3a] BIGINT,
    [count_4] BIGINT,
    [count_4a] BIGINT,
    [count_5] BIGINT,
    [count_5a] BIGINT,
    [count_6] BIGINT,
    [count_6a] BIGINT,
    [count_7] BIGINT,
    [count_7a] BIGINT,
    [count_8] BIGINT,
    [count_8a] BIGINT,
    [count_9] BIGINT,
    [Final tag] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[SOPTable] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [HEAD] NVARCHAR(266),
    [HEADSEQUENCE] DECIMAL(18,0),
    [SUBHEAD] NVARCHAR(266),
    [SUBHEADSEQUENCE] DECIMAL(18,0),
    [CONTENTHEAD] NVARCHAR(266),
    [CONTENTHEADSEQUENCE] DECIMAL(18,0),
    [CONTENT] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SOPTable__C655572184EE17E1] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[specificMailTemplates] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [templatename] NVARCHAR(255),
    [mailcontent] NVARCHAR(max),
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [subject] NVARCHAR(555),
    CONSTRAINT [PK__specific__C6555721CC3C595E] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[specificModules] (
    [particulars] NVARCHAR(255),
    [name] NVARCHAR(255),
    [jsonData] NVARCHAR(max),
    [LID] INT NOT NULL IDENTITY(1,1),
    [ADDEDTIME] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDUSER] NVARCHAR(255),
    CONSTRAINT [PK__specific__C655572149F4298D] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[speedDocuments] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(max),
    [companyName] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [template] NVARCHAR(max),
    [startYear] INT,
    [endYear] INT,
    [type] NVARCHAR(255),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__speedDoc__DE105D07E90E359A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[speedDrive] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(max),
    [filesSaved] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedTime] DATETIME2,
    [year] INT,
    [type] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [role] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    CONSTRAINT [PK__speedDri__DE105D0756588501] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[sqlTableMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [tableName] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [category] NVARCHAR(max),
    [tableDropdown] NVARCHAR(max),
    [buttonName] VARCHAR(555),
    [displayName] VARCHAR(255),
    [parentTable] VARCHAR(255),
    CONSTRAINT [PK__sqlTable__DE105D0787988D46] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[stages] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [NAME] NVARCHAR(255),
    [TEST] NVARCHAR(255),
    [STAGE] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__stages__C65557210965A049] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[STATEMENTSCONTROL] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CREATEDBY] NVARCHAR(255),
    [MODIFIEDBY] NVARCHAR(255),
    [CREATEDDATETIME] NVARCHAR(255),
    [MODIFIEDDATETIME] NVARCHAR(255),
    [CATEGORY] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [ACCOUNTID] NVARCHAR(255),
    [PREDEFINEDLIST] NVARCHAR(255),
    [BASECURRENCY] NVARCHAR(255),
    [MODE] NVARCHAR(255),
    [ACCOUNTOWNER] NVARCHAR(255),
    [CHARGES] NVARCHAR(255),
    [KEYTERMS] NVARCHAR(255),
    [REMARKS] NVARCHAR(255),
    [disableObCheck] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[statutory] (
    [id] INT NOT NULL,
    [companyName] VARCHAR(255),
    [statement] VARCHAR(255),
    [date] DATE,
    [amount] DECIMAL(18,0),
    CONSTRAINT [PK__statutor__3213E83FF28CA62A] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[statutoryChallans] (
    [COMPANYID] VARCHAR(1),
    [COMPANYNAME] VARCHAR(1),
    [LID] VARCHAR(1),
    [STATUTE] VARCHAR(1),
    [CHALLANTYPE] VARCHAR(1),
    [CHALLANDATE] DATE,
    [CHALLANNO] VARCHAR(1),
    [RELEVANTFY] VARCHAR(1),
    [RELEVANTMONTH] VARCHAR(1),
    [BASICAMOUNT] VARCHAR(1),
    [INTEREST] VARCHAR(1),
    [PENALTY] VARCHAR(1),
    [TOTALAMT] VARCHAR(1),
    [BANKDETAILS] VARCHAR(1),
    [BSRCODE] VARCHAR(1)
);

-- CreateTable
CREATE TABLE [dbo].[SubCategories] (
    [SCID] INT NOT NULL,
    [SubCategoryName] NVARCHAR(max),
    [CID] INT,
    CONSTRAINT [PK__SubCateg__F7FE93AC6395C4E5] PRIMARY KEY CLUSTERED ([SCID])
);

-- CreateTable
CREATE TABLE [dbo].[subEntries] (
    [SEID] INT NOT NULL,
    [SubEntryName] NVARCHAR(max),
    [EID] INT,
    [Total1] NVARCHAR(max),
    [Total2] NVARCHAR(max),
    CONSTRAINT [PK__subEntri__F56A975E0A5A0F36] PRIMARY KEY CLUSTERED ([SEID])
);

-- CreateTable
CREATE TABLE [dbo].[SUBFORMTEMPLATE1] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [DESCRIPTION] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [DATE] NVARCHAR(255),
    [LOOKUP1] NVARCHAR(255),
    [DROPDOWN1] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [PARENTID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    CONSTRAINT [PK__SUBFORMT__C6555721787808E6] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SUBFORMTEMPLATE2] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [ITEMNAME] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [VALUE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [PARENTID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    CONSTRAINT [PK__SUBFORMT__C6555721C0543FA9] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SUBFORMTEMPLATE3] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [ITEMNAME] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [VALUE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [PARENTID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [userid] NVARCHAR(255),
    CONSTRAINT [PK__SUBFORMT__C6555721198A4821] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[subscriptionTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(max),
    [plann] NVARCHAR(255),
    [course] NVARCHAR(max),
    [courseStatus] NVARCHAR(max),
    [amount] INT,
    [status] NVARCHAR(max),
    [addedTime] DATE,
    [activeUser] NVARCHAR(255),
    [courseProgress] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    [addedUser] NVARCHAR(max),
    CONSTRAINT [PK__subscrip__DE105D0774DF1EFD] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_ALLOBSERVATIONS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [MODULEID] NVARCHAR(255),
    [MODULE] NVARCHAR(255),
    [CATEGORY] NVARCHAR(255),
    [COMMENT] NVARCHAR(255),
    [PERSONRESPONSIBLE] NVARCHAR(255),
    [STATUS] NVARCHAR(255),
    [EDOC] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [ADDEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [FINANCIALYEAR] NVARCHAR(255),
    CONSTRAINT [PK__SYF_ALLO__C6555721AC201B49] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_BRANCHMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [BRANCH] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_BRAN__C6555721C0235345] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_COMPANYACBKMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] INT,
    [COMPANYNAME] NVARCHAR(500),
    [ENTITY] NVARCHAR(100),
    [SOFTWARE] NVARCHAR(500),
    [FROMDATE] DATETIME2,
    [TODATE] DATETIME2,
    [NAMEPERSOFTWARE] NVARCHAR(500),
    [ORGANIZATIONID] NVARCHAR(500),
    [CLIENTID] NVARCHAR(max),
    [CLIENTSECRET] NVARCHAR(max),
    [SCOPE] NVARCHAR(max),
    [AUTHTOKEN] NVARCHAR(max),
    [REFRESHTOKEN] NVARCHAR(max),
    [DOMAIN] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(100),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(100),
    [MODIFIEDTIME] DATETIME2,
    [EMAIL] NVARCHAR(100),
    [id] INT,
    CONSTRAINT [PK__SYF_COMP__C6555721729A3E09] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_COMPANYMASTER] (
    [USERID] INT,
    [USERNAME] NVARCHAR(100),
    [EMAIL] NVARCHAR(100),
    [COMPANYNAME] NVARCHAR(100),
    [ENTITY] NVARCHAR(100),
    [COUNTRY] NVARCHAR(100),
    [ADDEDUSER] NVARCHAR(100),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(100),
    [MODIFIEDTIME] DATETIME2,
    [PERMANENTADDRESS] NVARCHAR(max),
    [BILLINGADDRESS] NVARCHAR(max),
    [LOGO] NVARCHAR(max),
    [PAN] NVARCHAR(max),
    [FINANCIALSTARTMONTH] NVARCHAR(50),
    [STATUS] NVARCHAR(50),
    [DEFAULTLOAD] VARCHAR(50),
    [COMPANYID] NVARCHAR(10),
    [CINLLPIN] NVARCHAR(255),
    [DATEFORMAT] NVARCHAR(10),
    [lid] INT NOT NULL IDENTITY(1,1),
    [SUBSCRIPTION] NVARCHAR(255),
    [GROUPID] BIGINT,
    [GROUPNAME] NVARCHAR(255),
    [VISION] NVARCHAR(max),
    [MISSION] NVARCHAR(max),
    [COMPANYVALUES] NVARCHAR(max),
    [FUNCTIONALGOALS] NVARCHAR(max),
    CONSTRAINT [PK__SYF_COMP__DE105D0755CF555A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_GLOBALTEMPLATES] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [CATEGORY] NVARCHAR(255),
    [SUBCATEGORY] NVARCHAR(255),
    [NAME] NVARCHAR(500),
    [HTMLTEMPLATE] NVARCHAR(max),
    [SETTINGS] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    [STANDARDPATH] NVARCHAR(max),
    CONSTRAINT [PK__SYF_GLOB__C65557212EE4331D] PRIMARY KEY CLUSTERED ([LID]),
    CONSTRAINT [UQ__SYF_GLOB__D9C1FA00A45061C6] UNIQUE NONCLUSTERED ([NAME])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_GSTMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [GSTIN] NVARCHAR(255),
    [GSTUSERNAME] NVARCHAR(255),
    [ACCESSTOKEN] NVARCHAR(1000),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_GSTM__C655572152EB2A33] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_LEADS] (
    [COMPANYNAME] NVARCHAR(255) NOT NULL,
    [COMPANYID] NVARCHAR(255) NOT NULL,
    [DATEOFREQUEST] NVARCHAR(255),
    [CLIENTTYPE] NVARCHAR(255),
    [PARTNERTOHANDLE] NVARCHAR(255),
    [PROSPECTNAME] NVARCHAR(255),
    [PRODUCTDESCRIPTION] NVARCHAR(255),
    [LEADSTATUS] NVARCHAR(255) NOT NULL,
    [HEAT] NVARCHAR(255),
    [ESTIMATE] NVARCHAR(255),
    [FINAL] NVARCHAR(255),
    [BRIGADEALLOCATED] NVARCHAR(255),
    [DATEOFPROPOSAL] NVARCHAR(255),
    [DATEOFREVISEDPROPOSAL] NVARCHAR(255),
    [DATEOFCONFIRMATIONORREJECTION] NVARCHAR(255),
    [REMARKS] NVARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] DATETIME2,
    [addedtime] DATETIME2,
    [userid] INT,
    [assignmentType] NVARCHAR(250),
    [contactName] NVARCHAR(250),
    [leadCreatedBy] NVARCHAR(250),
    [allocatedTo] NVARCHAR(250),
    [phoneNumber] NVARCHAR(255),
    [email] NVARCHAR(255),
    [leadSource] NVARCHAR(255),
    [referredBy] NVARCHAR(255),
    [industry] NVARCHAR(255),
    CONSTRAINT [pk_syfLeads] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_MODULEMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [CATEGORY] NVARCHAR(max),
    [SUBCATEGORY] NVARCHAR(max),
    [NAME] NVARCHAR(max),
    [MONTHLYPRICING] INT,
    [ANNUALPRICING] INT,
    [ADDEDUSER] NVARCHAR(max),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(max),
    [MODIFIEDTIME] DATETIME2,
    [SOURCE] NVARCHAR(max),
    CONSTRAINT [PK__SYF_MODU__C6555721FDC4B712] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_PLANMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [NAME] NVARCHAR(255),
    [MODULE] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_PLAN__C65557214D9BC910] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[syf_reco] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [companyId] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [NAME] NVARCHAR(255),
    [recoJson] NVARCHAR(max),
    [addedUser] NVARCHAR(255),
    [addedTime] NVARCHAR(255),
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] NVARCHAR(255),
    CONSTRAINT [PK__syf_reco__C6555721504C76DC] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[syf_reco_table_a] (
    [gpk] NVARCHAR(50),
    [InvNo] NVARCHAR(50),
    [gstin] NVARCHAR(50),
    [rec_date] NVARCHAR(50),
    [amount] NVARCHAR(50),
    [recoid] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [recotag] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[syf_reco_table_b] (
    [gpk] NVARCHAR(10),
    [inv_no] NVARCHAR(10),
    [gstin] NVARCHAR(50),
    [reco_date] NVARCHAR(8),
    [amount] NVARCHAR(10),
    [recoid] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [recotag] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[SYF_SPEEDDRIVEMASTERS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [TEMPLATEID] INT,
    [TEMPLATENAME] NVARCHAR(255),
    [TEMPLATECATEGORY] NVARCHAR(255),
    [CATEGORYMANDATORY] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [NATURE] NVARCHAR(255),
    [GROUPID] INT,
    [COMPANYID] INT,
    [STANDARDPATH] NVARCHAR(max),
    [ISPATHEDITABLE] NVARCHAR(max),
    [ISYEARSPECIFIC] NVARCHAR(255),
    [ASSIGNMENTNATURE] NVARCHAR(255),
    [HTMLTEMPLATE] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_SPEE__C6555721A6EAFDD2] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_SPEEDMASTERS] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [TEMPLATEID] INT,
    [TEMPLATENAME] NVARCHAR(255),
    [TEMPLATECATEGORY] NVARCHAR(255),
    [CATEGORYMANDATORY] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [NATURE] NVARCHAR(255),
    [GROUPID] INT,
    [COMPANYID] INT,
    [STANDARDPATH] NVARCHAR(max),
    [ISPATHEDITABLE] NVARCHAR(max),
    [ISYEARSPECIFIC] NVARCHAR(255),
    [ASSIGNMENTNATURE] NVARCHAR(255),
    [HTMLTEMPLATE] NVARCHAR(max),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_SPEE__C65557215A16939E] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_TANMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [USERID] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [TANNO] NVARCHAR(255),
    [TANUSERNAME] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDUSER] NVARCHAR(255),
    [MODIFIEDTIME] DATETIME2,
    CONSTRAINT [PK__SYF_TANM__C655572124960DC0] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[SYF_USERMASTER] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [EMAIL] NVARCHAR(256),
    [PASSWORD] NVARCHAR(255),
    [SALT] NVARCHAR(255),
    [resetToken] NVARCHAR(255),
    [tokenExpiration] NVARCHAR(255),
    [failedLoginAttempts] INT CONSTRAINT [SYF_USERMASTER_failedLoginAttempts_df] DEFAULT 0,
    [lastFailedLogin] DATETIME2,
    [lastLogin] DATETIME2,
    [emailVerificationToken] NVARCHAR(255),
    [verificationExpires] DATETIME2,
    [NAME] NVARCHAR(100),
    [FIRSTNAME] NVARCHAR(255),
    [LASTNAME] NVARCHAR(255),
    [DOB] DATETIME2,
    [GENDER] NVARCHAR(50),
    [MARITALSTATUS] NVARCHAR(50),
    [PHONENUMBER] NVARCHAR(255),
    [COUNTRY] NVARCHAR(100),
    [PROFILEIMAGE] VARCHAR(1000),
    [SUBSCRIPTION] NVARCHAR(100),
    [ADDEDTIME] DATETIME2,
    [MODIFIEDTIME] DATETIME2,
    [SECRETQUESTIONS] NVARCHAR(255),
    [SECRETANSWERS] NVARCHAR(255),
    [ISTALLYSUBSCRIBED] BIT,
    [ISZOHOSUBSCRIBED] BIT,
    [ISWEBAPPSUBSCRIBED] BIT,
    [ZBStatus] NVARCHAR(255),
    [TYPE] NVARCHAR(255),
    [STATUS] NVARCHAR(20) CONSTRAINT [SYF_USERMASTER_STATUS_df] DEFAULT 'PENDING',
    CONSTRAINT [PK__SYF_USER__C65557215924AFAD] PRIMARY KEY CLUSTERED ([LID]),
    CONSTRAINT [UQ__SYF_USER__161CF72452D889F2] UNIQUE NONCLUSTERED ([EMAIL])
);

-- CreateTable
CREATE TABLE [dbo].[syncTime] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [entity] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [tableName] NVARCHAR(255),
    [description] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [addedUser] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B610C5FA796] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[tableMaster] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [TABLENAME] NVARCHAR(255),
    [TABLELINKNAME] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tagMaster] (
    [lid] INT NOT NULL,
    [tag] NVARCHAR(max),
    [tagGroup] NVARCHAR(max),
    [type] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__tagMaste__DE105D0745B6B19A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[TagsMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [tag] NVARCHAR(255),
    [ref] NVARCHAR(255),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    CONSTRAINT [PK__TagsMast__DE105D072D985C9D] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tally_allvouchers_py] (
    [date] NVARCHAR(max),
    [guid] NVARCHAR(max),
    [gstregnType] NVARCHAR(max),
    [partyGstin] NVARCHAR(max),
    [voucherKey] NVARCHAR(max),
    [recordTime] NVARCHAR(max),
    [interOrIntra] NVARCHAR(max),
    [voucherType] NVARCHAR(max),
    [voucherNo] NVARCHAR(max),
    [ledger] NVARCHAR(max),
    [costCentre] NVARCHAR(max),
    [amount] NVARCHAR(max),
    [partyLedger] NVARCHAR(max),
    [narration] NVARCHAR(max),
    [lineItemNarration] NVARCHAR(max),
    [stockitem] NVARCHAR(max),
    [quantity] NVARCHAR(max),
    [rate] NVARCHAR(max),
    [gstRate] NVARCHAR(max),
    [type] NVARCHAR(max),
    [agstRefNo] NVARCHAR(max),
    [paidThrough] NVARCHAR(max),
    [jsonRef] NVARCHAR(max),
    [tag] NVARCHAR(max),
    [drsTrn] NVARCHAR(max),
    [crTrn] NVARCHAR(max),
    [bankTrn] NVARCHAR(max),
    [gstOutTrn] NVARCHAR(max),
    [gstInwTrn] NVARCHAR(max),
    [tdsPaTrn] NVARCHAR(max),
    [saleTrn] NVARCHAR(max),
    [purTrn] NVARCHAR(max),
    [cashTrn] NVARCHAR(max),
    [identifiedDr] NVARCHAR(max),
    [identifiedCr] NVARCHAR(max),
    [crordr] NVARCHAR(max),
    [drsDrTrn] NVARCHAR(max),
    [drsCrTrn] NVARCHAR(max),
    [crsDrTrn] NVARCHAR(max),
    [crsCrTrn] NVARCHAR(max),
    [ISCOMPOUND] NVARCHAR(3),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [reference] NVARCHAR(255),
    [referencedate] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tally_allvouchers_py_joined] (
    [date] NVARCHAR(max),
    [guid] NVARCHAR(max),
    [gstregnType] NVARCHAR(max),
    [partyGstin] NVARCHAR(max),
    [voucherKey] NVARCHAR(max),
    [recordTime] NVARCHAR(max),
    [interOrIntra] NVARCHAR(max),
    [voucherType] NVARCHAR(max),
    [voucherNo] NVARCHAR(max),
    [ledger] NVARCHAR(max),
    [costCentre] NVARCHAR(max),
    [amount] NVARCHAR(max),
    [partyLedger] NVARCHAR(max),
    [narration] NVARCHAR(max),
    [lineItemNarration] NVARCHAR(max),
    [stockitem] NVARCHAR(max),
    [quantity] NVARCHAR(max),
    [rate] NVARCHAR(max),
    [gstRate] NVARCHAR(max),
    [type] NVARCHAR(max),
    [agstRefNo] NVARCHAR(max),
    [paidThrough] NVARCHAR(max),
    [jsonRef] NVARCHAR(max),
    [tag] NVARCHAR(max),
    [drsTrn] NVARCHAR(max),
    [crTrn] NVARCHAR(max),
    [bankTrn] NVARCHAR(max),
    [gstOutTrn] NVARCHAR(max),
    [gstInwTrn] NVARCHAR(max),
    [tdsPaTrn] NVARCHAR(max),
    [saleTrn] NVARCHAR(max),
    [purTrn] NVARCHAR(max),
    [cashTrn] NVARCHAR(max),
    [identifiedDr] NVARCHAR(max),
    [identifiedCr] NVARCHAR(max),
    [crordr] NVARCHAR(max),
    [drsDrTrn] NVARCHAR(max),
    [drsCrTrn] NVARCHAR(max),
    [crsDrTrn] NVARCHAR(max),
    [crsCrTrn] NVARCHAR(max),
    [systemvouchertype] NVARCHAR(max),
    [groupedunder] NVARCHAR(max),
    [primarytag] NVARCHAR(max),
    [supplytype] NVARCHAR(max),
    [gstrcm] NVARCHAR(max),
    [coagstrate] NVARCHAR(max),
    [cgstsgstigst] NVARCHAR(max),
    [gstname] NVARCHAR(max),
    [branch] NVARCHAR(max),
    [zohocoa] NVARCHAR(255),
    [zohodimension1] NVARCHAR(255),
    [zohodimension2] NVARCHAR(255),
    [zohodimension3] NVARCHAR(255),
    [zohodimension4] NVARCHAR(255),
    [bspl] NVARCHAR(2),
    [iscompound] NVARCHAR(3),
    [zohocontact] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [reference] NVARCHAR(255),
    [referencedate] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tally_ledgers_py] (
    [LEDGERNAME] NVARCHAR(255),
    [GROUPEDUNDER] NVARCHAR(255),
    [TAXTYPE] NVARCHAR(255),
    [GSTIN] NVARCHAR(255),
    [RATEOFTAX] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tally_rawvouchers_py] (
    [date] NVARCHAR(255),
    [guid] NVARCHAR(255),
    [gstregnType] NVARCHAR(255),
    [partyGstin] NVARCHAR(255),
    [voucherKey] NVARCHAR(255),
    [recordTime] NVARCHAR(255),
    [interOrIntra] NVARCHAR(255),
    [voucherType] NVARCHAR(255),
    [voucherNo] NVARCHAR(255),
    [ledger] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [partyLedger] NVARCHAR(255),
    [narration] NVARCHAR(max),
    [lineItemNarration] NVARCHAR(max),
    [stockitem] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [rate] NVARCHAR(255),
    [gstRate] NVARCHAR(255),
    [type] NVARCHAR(255),
    [agstRefNo] NVARCHAR(255),
    [paidThrough] NVARCHAR(255),
    [jsonRef] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [reference] NVARCHAR(255),
    [referencedate] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [costCentre] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tally_tb_py] (
    [ACCNAME] NVARCHAR(155),
    [OB] NVARCHAR(155),
    [DR] NVARCHAR(155),
    [CR] NVARCHAR(155),
    [CB] NVARCHAR(155),
    [FROMDATE] NVARCHAR(255),
    [TODATE] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tally_vouchertype_py] (
    [VOUCHERNAME] NVARCHAR(255),
    [SYSTEMVOUCHERTYPE] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [CONSIDERTRAN] NVARCHAR(3),
    [lid] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    CONSTRAINT [PK_1387868011] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tallyLedger_dataTransfer] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [ADDRESS] NVARCHAR(max),
    [MAILINGNAME] VARCHAR(255),
    [LEDGERPHONE] VARCHAR(255),
    [LEDGERCONTACT] VARCHAR(255),
    [ISBILLWISEON] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [BILLALLOCATIONS] NVARCHAR(max),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [GSTIN] VARCHAR(255),
    [ggshCoa] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [LEDGERGROUP] VARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [tallyGroup] NVARCHAR(max),
    [tallySubGroup] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[tanMaster] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [TAN_NO] NVARCHAR(255),
    [TRACESUSERNAME] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__tanMaste__DE105D071074D2FA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbCoaMapping] (
    [lid] INT NOT NULL,
    [clientName] NVARCHAR(max),
    [startDate] NVARCHAR(max),
    [endDate] NVARCHAR(max),
    [fy] NVARCHAR(max),
    [rawCoa] NVARCHAR(max),
    [ggshCoa] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    [alieSeq] INT,
    [classificatonSeq] INT,
    [headSeq] INT,
    [subHeadSeq] INT,
    CONSTRAINT [PK__tbCoaMap__DE105D07B830E086] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[TBL_AH_OPBillMetadata] (
    [Bill_No_With_SerialNo_Date] VARCHAR(255) NOT NULL,
    [S_No] VARCHAR(255),
    [Reg_No_UHID] VARCHAR(255),
    [Token_No_Time] VARCHAR(255),
    [Bill_Time] VARCHAR(255),
    [Patient_Name] VARCHAR(255),
    [OP_NO] VARCHAR(255),
    [Doctor_code] VARCHAR(255),
    [Dr_Name_Counsellor_Name] VARCHAR(255),
    [Referred_By] VARCHAR(255),
    [Bill_Amount] VARCHAR(255),
    [Concession] VARCHAR(255),
    [BD_Date_Time] VARCHAR(255),
    [BD_Head_or_Type] VARCHAR(255),
    [BD_Test] VARCHAR(255),
    [BD_Sub_Test] VARCHAR(255),
    [BD_Amount] VARCHAR(255),
    [Settlements] NVARCHAR(max),
    CONSTRAINT [PK_Bill_No_With_SerialNo_Date_OPBillMetadata] PRIMARY KEY CLUSTERED ([Bill_No_With_SerialNo_Date])
);

-- CreateTable
CREATE TABLE [dbo].[TBL_AH_OPBillRangeOfDate] (
    [bill_date] DATE NOT NULL,
    [bill_start_no] INT NOT NULL,
    [bill_end_no] INT,
    CONSTRAINT [PK_BILL_DATE_AH_OPBillRangeOfDate] PRIMARY KEY CLUSTERED ([bill_date])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_FAQ_Admin] (
    [id] VARCHAR(255) NOT NULL,
    [question] VARCHAR(255) NOT NULL,
    [answer] VARCHAR(255) NOT NULL,
    [image_url] VARCHAR(255),
    [video_url] VARCHAR(255),
    [link_url] VARCHAR(255),
    CONSTRAINT [PK__tbl_FAQ___3213E83F2240BB5D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_FAQ_Admindata] (
    [id] VARCHAR(255) NOT NULL,
    [question] NVARCHAR(max),
    [answer] NVARCHAR(max),
    [image_url] NVARCHAR(max),
    [video_url] NVARCHAR(max),
    [link_url] NVARCHAR(max),
    CONSTRAINT [PK__tbl_FAQ___3213E83F355CF2B8] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_FAQ_Categories] (
    [CategoryID] VARCHAR(255) NOT NULL,
    [CategoryName] VARCHAR(255) NOT NULL,
    [Parent] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_FAQ_Master] (
    [ID] INT NOT NULL,
    [Name] VARCHAR(255) NOT NULL,
    [Email] VARCHAR(255) NOT NULL,
    [Query] VARCHAR(255) NOT NULL,
    [Answers] VARCHAR(255),
    [Category] VARCHAR(255),
    [ReferenceLinks] VARCHAR(255),
    CONSTRAINT [PK__tbl_FAQ___3214EC2703AAF56E] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_FAQ_Masters] (
    [ID] VARCHAR(255) NOT NULL,
    [NAME] VARCHAR(255) NOT NULL,
    [EMAIL] VARCHAR(255) NOT NULL,
    [QUERY] VARCHAR(255) NOT NULL,
    [ANSWERS] VARCHAR(255),
    [CATEGORY] VARCHAR(255),
    [REF_LINKS] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_CompanyMasters] (
    [STARTINGFROM] VARCHAR(255),
    [ENDINGAT] VARCHAR(255),
    [CMPSTATUS] VARCHAR(255),
    [EMAIL] NVARCHAR(100),
    [COMPANYIDACBKMASTER] INT,
    [companyid] VARCHAR(255),
    [companyname] VARCHAR(255),
    [ACBKID] INT,
    [companytagforbgsync] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_CostCentreMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [CATEGORY] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_Currencies] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [ACTIVEFROM] VARCHAR(255),
    [ACTIVETO] VARCHAR(255),
    [NARRATION] VARCHAR(255),
    [EXPANDEDSYMBOL] VARCHAR(255),
    [DECIMALPLACES] VARCHAR(255),
    [UPDATEDDATETIME] VARCHAR(255),
    [ISOCURRENCYCODE] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_GoDowns] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [ACTIVEFROM] VARCHAR(255),
    [ACTIVETO] VARCHAR(255),
    [NARRATION] VARCHAR(255),
    [STATENAME] VARCHAR(255),
    [PINCODE] VARCHAR(255),
    [PHONENUMBER] VARCHAR(255),
    [UPDATEDDATETIME] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_GroupMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [DEBITTOTALS] VARCHAR(255),
    [CREDITTOTALS] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_LedgerMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [ADDRESS] NVARCHAR(max),
    [MAILINGNAME] VARCHAR(255),
    [LEDGERPHONE] VARCHAR(255),
    [LEDGERCONTACT] VARCHAR(255),
    [ISBILLWISEON] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [BILLALLOCATIONS] NVARCHAR(max),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [GSTIN] VARCHAR(255),
    [ggshCoa] NVARCHAR(max),
    [alie] NVARCHAR(max),
    [bspl] NVARCHAR(max),
    [classification] NVARCHAR(max),
    [head] NVARCHAR(max),
    [subHead] NVARCHAR(max),
    [LEDGERGROUP] VARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    [tallyGroup] NVARCHAR(max),
    [tallySubGroup] NVARCHAR(max),
    [CLIENTNAMETALLYAPP] VARCHAR(255),
    [email] NVARCHAR(100),
    [tallycompanyid] VARCHAR(50),
    [PARENTID] NVARCHAR(255),
    CONSTRAINT [PK__tbl_tall__DE105D07240C629B] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_StockGroupMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_StockItemMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [PARENT] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [BASEUNITS] VARCHAR(255),
    [DESCRIPTION] VARCHAR(255),
    [BATCHALLOCATIONS] VARCHAR(max),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_TrialBalances] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [PARTICULARS] VARCHAR(255),
    [LEDGERGROUP] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [DEBIT] VARCHAR(255),
    [CREDIT] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [FROMDATE] VARCHAR(255),
    [TODATE] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [fromDateType] DATE,
    [toDateType] DATE,
    [PERIOD] VARCHAR(255),
    [Dim1] VARCHAR(255),
    [Dim2] VARCHAR(255),
    [Dim3] VARCHAR(255),
    [actualOrBudget] VARCHAR(255),
    [coaOwner] VARCHAR(255),
    [adjustments] VARCHAR(255),
    [postAdjClBal] VARCHAR(255),
    [parentOrChildTb] VARCHAR(255),
    [LedgerCode] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [CLIENTNAMETALLYAPP] VARCHAR(255),
    [FY] NVARCHAR(10),
    [email] NVARCHAR(100),
    [tallycompanyid] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_UnitMasters] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [NAME] VARCHAR(255),
    [BASEUNITS] VARCHAR(255),
    [ADDITIONALUNITS] VARCHAR(255),
    [ACTIVEFROM] VARCHAR(255),
    [ACTIVETO] VARCHAR(255),
    [NARRATION] VARCHAR(255),
    [CONVERSION] VARCHAR(255),
    [ISSIMPLEUNIT] VARCHAR(255),
    [ISGSTEXCLUDED] VARCHAR(255),
    [DECIMALPLACES] VARCHAR(255),
    [UPDATEDDATETIME] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [email] NVARCHAR(100),
    [COMPANYIDACBKMASTER] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_tallyprime_vouchers] (
    [DATE] NVARCHAR(max),
    [VOUCHERTYPENAME] NVARCHAR(max),
    [VOUCHERNUMBER] NVARCHAR(max),
    [VOUCHERKEY] NVARCHAR(max),
    [LEDGERNAME] NVARCHAR(max),
    [ACCOUNTINGALLOCATIONSAMOUNT] NVARCHAR(max),
    [NARRATION] NVARCHAR(max),
    [COSTCENTRE] NVARCHAR(max),
    [COMPANYID] NVARCHAR(max),
    [COMPANYNAME] NVARCHAR(max),
    [DeviceUUID] NVARCHAR(max),
    [SYNCTIMESTAMP] VARCHAR(255),
    [DBID] NVARCHAR(max),
    [TALLYGUID] NVARCHAR(max),
    [SOURCESYSTEM] VARCHAR(255),
    [LASTMODIFIED] VARCHAR(255),
    [CLIENTNAMETALLYAPP] VARCHAR(255),
    [email] NVARCHAR(100),
    [tallycompanyid] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[tbl_workflows_bills] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [po_number] NVARCHAR(255),
    [supplier_name] NVARCHAR(255),
    [bill_date] NVARCHAR(255),
    [due_date] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [tax_amount] NVARCHAR(255),
    [invoice_number] NVARCHAR(255),
    [payment_status] NVARCHAR(255),
    [net_amount] NVARCHAR(255),
    [remarks] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] NVARCHAR(255),
    [grn_number] NVARCHAR(255),
    CONSTRAINT [PK__tbl_work__DE105D0711EE1756] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_workflows_grn] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [po_number] NVARCHAR(255),
    [supplier_name] NVARCHAR(255),
    [receipt_date] NVARCHAR(255),
    [status] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] NVARCHAR(255),
    CONSTRAINT [PK__tbl_work__DE105D07C39B71C2] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_workflows_grnitems] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [grnnumber] NVARCHAR(255),
    [item] NVARCHAR(255),
    [quantity_received] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] NVARCHAR(255),
    [purchase_price] NVARCHAR(255),
    [yet_to_receive] NVARCHAR(255),
    [order_quantity] NVARCHAR(255),
    CONSTRAINT [PK__tbl_work__DE105D07BECBC674] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_workflows_purchaseorder] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [supplier_name] NVARCHAR(255),
    [supplier_email] NVARCHAR(255),
    [order_date] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] NVARCHAR(255),
    [accepted_date] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [status] NVARCHAR(255),
    CONSTRAINT [PK__tbl_work__DE105D07D8610B34] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_workflows_purchaseorderitem] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyname] NVARCHAR(255),
    [item] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [price] NVARCHAR(255),
    [total] NVARCHAR(255),
    [addedtime] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [modifiedtime] NVARCHAR(255),
    [userid] NVARCHAR(255),
    [orderid] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [total_received] NVARCHAR(255),
    CONSTRAINT [PK__tbl_work__DE105D07E7EEE761] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tbl_ZohoConnectorRegistrations] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [clientName] NVARCHAR(max),
    [clientCode] NVARCHAR(max),
    [userOrGroupEmailID] NVARCHAR(max),
    [clientID] NVARCHAR(max),
    [clientSecret] NVARCHAR(max),
    [scope] NVARCHAR(max),
    [refreshToken] NVARCHAR(max),
    [accessToken] NVARCHAR(max),
    [redirectURL] NVARCHAR(max),
    [isActive] BIT,
    [isZohoBGServiceEnabled] BIT,
    [autoSyncEnabled] BIT,
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    CONSTRAINT [PK__tbl_Zoho__DE105D07F84E9C11] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tblUserDetails] (
    [UserID] INT NOT NULL IDENTITY(1,1),
    [EmailID] NVARCHAR(255),
    [Role] VARCHAR(255) NOT NULL,
    [IsAdmin] BIT,
    [IsActiveUser] BIT,
    [password] VARCHAR(255) NOT NULL,
    [client] NVARCHAR(max),
    [USERNAME] VARCHAR(255),
    [mobile] VARCHAR(255),
    [country] VARCHAR(255),
    [companyName] VARCHAR(255),
    [companyId] VARCHAR(255),
    [addedUser] VARCHAR(255),
    [addedTime] VARCHAR(255),
    CONSTRAINT [PK__tblUserD__1788CCAC1DD1020F] PRIMARY KEY CLUSTERED ([UserID])
);

-- CreateTable
CREATE TABLE [dbo].[tdsInvoices] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [vendorName] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [service] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [igstRate] NVARCHAR(255),
    [igstAmount] NVARCHAR(255),
    [cgstRate] NVARCHAR(255),
    [cgstAmount] NVARCHAR(255),
    [sgstRate] NVARCHAR(255),
    [sgstAmount] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [taxInvoiceNo] NVARCHAR(255),
    [date] DATETIME2,
    [hsncode] NVARCHAR(255),
    [placeOfSupply] NVARCHAR(255),
    [clientAddress] NVARCHAR(800),
    [clientGstin] NVARCHAR(250),
    CONSTRAINT [PK__tdsInvoi__DE105D076405C4FC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tdsMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [rate] VARCHAR(555),
    [nature] VARCHAR(555),
    [tdsSection] VARCHAR(555),
    [treshold] VARCHAR(555),
    [effStartDate] VARCHAR(555),
    [effEndDate] VARCHAR(555),
    [sectionExplanation] VARCHAR(555),
    [remarks] VARCHAR(555),
    [individualTransLimit] VARCHAR(555),
    CONSTRAINT [PK__tdsMaste__DE105D07F60B9124] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[teamHierarchy] (
    [EMPLOYEENAME] NVARCHAR(55),
    [EMPLOYEEROLE] NVARCHAR(55),
    [REPORTINGTO] NVARCHAR(55)
);

-- CreateTable
CREATE TABLE [dbo].[temp] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [team] NVARCHAR(max),
    [role] NVARCHAR(max),
    [title] NVARCHAR(max),
    [type] NVARCHAR(max),
    [uploadurl] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATE,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATE,
    [iframe] NVARCHAR(max),
    [question] NVARCHAR(max),
    [subCategory] NVARCHAR(max),
    CONSTRAINT [PK__temp__DE105D075312D37E] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[temp_stage_tb] (
    [LEDGER] NVARCHAR(255),
    [MIG_OB] NVARCHAR(255),
    [MIG_DR_TRAN] NVARCHAR(255),
    [MIG_CR_TRAN] NVARCHAR(255),
    [MIG_CB] NVARCHAR(255),
    [ISTRANAVL] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[templateBuilder] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [l1] NVARCHAR(max),
    [l2] NVARCHAR(max),
    [l3] NVARCHAR(max),
    [s1] NVARCHAR(max),
    [s2] NVARCHAR(max),
    [s3] NVARCHAR(max),
    [tempId] INT,
    CONSTRAINT [PK__template__DE105D07A30F7A64] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[templateHeadings] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(max),
    [level] INT,
    [tempId] INT,
    CONSTRAINT [PK__template__DE105D0713BC3A29] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[templateList] (
    [lid] INT NOT NULL,
    [name] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [template] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    [category] NVARCHAR(max),
    [tempFunction] NVARCHAR(max),
    CONSTRAINT [PK__template__DE105D07164EFFD9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[templateMaster] (
    [lid] INT NOT NULL,
    [sequence] INT,
    [module] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [assignmentNature] NVARCHAR(max),
    [category] NVARCHAR(max),
    [subCategory] NVARCHAR(max),
    [yearType] NVARCHAR(max),
    [month] NVARCHAR(max),
    [entity] NVARCHAR(max),
    [attchment] NVARCHAR(max),
    [status] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME,
    [year] NVARCHAR(max),
    CONSTRAINT [PK__template__DE105D0743D7EF83] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[templateTransaction] (
    [tempID] INT,
    [sequence] INT,
    [module] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [clientCode] NVARCHAR(max),
    [assignmentNature] NVARCHAR(max),
    [category] NVARCHAR(max),
    [subCategory] NVARCHAR(max),
    [yearType] NVARCHAR(max),
    [year] NVARCHAR(max),
    [month] NVARCHAR(max),
    [entity] NVARCHAR(max),
    [attchment] NVARCHAR(max),
    [status] NVARCHAR(max),
    [projectCode] INT,
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME,
    [FINANCIALYEAR] VARCHAR(255),
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [htmltemplate] NVARCHAR(max),
    [LID] INT NOT NULL IDENTITY(1,1),
    [standardPath] NVARCHAR(255),
    CONSTRAINT [UQ__template__5FE897BCFD55D290] UNIQUE NONCLUSTERED ([COMPANYID])
);

-- CreateTable
CREATE TABLE [dbo].[test] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    CONSTRAINT [PK__test__DE105D0714778022] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test_2] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    CONSTRAINT [PK__test_2__DE105D07DFDAA9ED] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test_reco_a] (
    [partyname] NVARCHAR(255),
    [gstin] NVARCHAR(255),
    [invoiceno] NVARCHAR(255),
    [invoicedate] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [recoid] NVARCHAR(255),
    [recostatus] NVARCHAR(255),
    [recotag] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1)
);

-- CreateTable
CREATE TABLE [dbo].[test_reco_b] (
    [partyname] NVARCHAR(255),
    [gstin] NVARCHAR(255),
    [invoiceno] NVARCHAR(255),
    [invoicedate] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [recoid] NVARCHAR(255),
    [recostatus] NVARCHAR(255),
    [recotag] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1)
);

-- CreateTable
CREATE TABLE [dbo].[test1] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    CONSTRAINT [PK__test1__DE105D0760573783] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test12] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(max),
    [age] NVARCHAR(max),
    CONSTRAINT [PK__test_a__DE105D0761DF5D82] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test2] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    CONSTRAINT [PK__test2__DE105D0797413910] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test3] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    CONSTRAINT [PK__test3__DE105D07EA5C9591] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test4] (
    [lid] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__test4__DE105D07FDEED6EA] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[test5] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    [lname] NVARCHAR(max),
    CONSTRAINT [PK__test5__DE105D07D8385448] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[testing123] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test1] VARCHAR(555),
    [test2] VARCHAR(255),
    CONSTRAINT [PK__testing1__DE105D077B6C0005] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[testing25] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test1] VARCHAR(555),
    [test2] VARCHAR(255),
    [test3] VARCHAR(255),
    CONSTRAINT [PK__testing2__DE105D0709DDC744] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[testJuly] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [sample] VARCHAR(255),
    [sample2] VARCHAR(555),
    [test] VARCHAR(255),
    [test1] VARCHAR(255),
    [checks] VARCHAR(555),
    [checkField] VARCHAR(555),
    CONSTRAINT [PK__testJuly__DE105D070955B2C2] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[testTable] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [item] VARCHAR(555),
    [amt] VARCHAR(555),
    [test3] VARCHAR(555),
    CONSTRAINT [PK__testTabl__DE105D074B203807] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[trackGstReturns] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [valid] VARCHAR(555),
    [mof] VARCHAR(555),
    [dof] VARCHAR(555),
    [rtntype] VARCHAR(555),
    [ret_prd] VARCHAR(555),
    [arn] VARCHAR(555),
    [status] VARCHAR(555),
    [fy] VARCHAR(555),
    CONSTRAINT [PK__trackGst__DE105D0744FBE255] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[transactionQuestion] (
    [lid] INT NOT NULL,
    [clientName] NVARCHAR(max),
    [Category] NVARCHAR(max),
    [Question] NVARCHAR(max),
    [Answer] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__transact__DE105D0789239D5B] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[transactionReportMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [template] NVARCHAR(max),
    [templateName] NVARCHAR(max),
    [companyName] NVARCHAR(max),
    [startYear] INT,
    [endYear] INT,
    [letterHead] NVARCHAR(max),
    [address] NVARCHAR(max),
    [UDIN] NVARCHAR(max),
    [directorsName] NVARCHAR(max),
    [shareHoldersName] NVARCHAR(max),
    [status] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [createdBy] NVARCHAR(max),
    [reviewerAssign] NVARCHAR(max),
    [reviewStatus] NVARCHAR(max),
    [documentID] INT,
    [documentPath] NVARCHAR(max),
    CONSTRAINT [PK__transact__DE105D07412042A6] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[trialbalance_datatransfer] (
    [COMPANYID] VARCHAR(255),
    [COMPANYNAME] VARCHAR(255),
    [PARTICULARS] VARCHAR(255),
    [LEDGERGROUP] VARCHAR(255),
    [OPENINGBALANCE] VARCHAR(255),
    [DEBIT] VARCHAR(255),
    [CREDIT] VARCHAR(255),
    [CLOSINGBALANCE] VARCHAR(255),
    [FROMDATE] VARCHAR(255),
    [TODATE] VARCHAR(255),
    [DeviceUUID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [SYNCTIMESTAMP] VARCHAR(255),
    [TALLYGUID] NVARCHAR(max),
    [DBID] NVARCHAR(max),
    [fromDateType] DATE,
    [toDateType] DATE,
    [PERIOD] VARCHAR(255),
    [Dim1] VARCHAR(255),
    [Dim2] VARCHAR(255),
    [Dim3] VARCHAR(255),
    [actualOrBudget] VARCHAR(255),
    [coaOwner] VARCHAR(255),
    [adjustments] VARCHAR(255),
    [postAdjClBal] VARCHAR(255),
    [parentOrChildTb] VARCHAR(255),
    [LedgerCode] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [CLIENTNAMETALLYAPP] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[trialBalanceVersion] (
    [lid] INT NOT NULL,
    [clientName] NVARCHAR(max),
    [startDate] NVARCHAR(max),
    [endDate] NVARCHAR(max),
    [fy] NVARCHAR(max),
    [version] INT,
    [addedUser] NVARCHAR(max),
    [addedTime] NVARCHAR(max),
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] NVARCHAR(max),
    CONSTRAINT [PK__trialBal__DE105D07B4B9C66A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[trialtest24] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [test1] VARCHAR(555),
    [test2] VARCHAR(255),
    [test3] VARCHAR(255),
    CONSTRAINT [PK__trialtes__DE105D07D231BA6C] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[trialTesting] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [vendorName] NVARCHAR(max),
    [vendorTerms] NVARCHAR(max),
    [amount] DECIMAL(12,2),
    [nature] NVARCHAR(max),
    [description] NVARCHAR(max),
    [entryDate] DATETIME2,
    [batchNo] INT,
    CONSTRAINT [PK__trialTes__DE105D0751F2D182] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[typetest] (
    [transaction_date] DATE,
    [tdatetime] DATETIME,
    [amount] DECIMAL(18,6),
    [name] NVARCHAR(255),
    [headcount] INT
);

-- CreateTable
CREATE TABLE [dbo].[typetest_2] (
    [amount] DECIMAL(18,2),
    [name] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_bills] (
    [billDate] NVARCHAR(255),
    [billNumber] NVARCHAR(255),
    [itemName] NVARCHAR(255),
    [vendorName] NVARCHAR(255),
    [supplyType] NVARCHAR(255),
    [account] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [itemPrice] NVARCHAR(255),
    [itemDesc] NVARCHAR(255),
    [itemTax] NVARCHAR(255),
    [itemTaxRate] NVARCHAR(255),
    [costcentre] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [voucherType] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [billstatus] NVARCHAR(255),
    [hsnsac] NVARCHAR(255),
    [referenceinvoicetype] NVARCHAR(255),
    [taxtype] NVARCHAR(255),
    [tdsRate] NVARCHAR(255),
    [docudate] NVARCHAR(255),
    [tcs] NVARCHAR(255),
    [tds] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_costCenters] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [costcentergroups] NVARCHAR(255),
    [costcenters] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [modifiedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedTime] DATETIME2,
    [companyname] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    CONSTRAINT [PK__tzm_cost__DE105D0766912B56] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[tzm_customer_payment] (
    [date] NVARCHAR(255),
    [paymentNumberPrefix] NVARCHAR(255),
    [paymentNumberSuffix] NVARCHAR(255),
    [customerName] NVARCHAR(255),
    [depositTo] NVARCHAR(255),
    [description] NVARCHAR(max),
    [amount] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [paymenttype] NVARCHAR(255),
    [tallyvoucherkey] NVARCHAR(255),
    [tallyvouchernumber] NVARCHAR(255),
    [prefix] NVARCHAR(255),
    [suffix] NVARCHAR(255),
    [mode] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_invoices] (
    [invoiceDate] NVARCHAR(255),
    [invoiceNumber] NVARCHAR(255),
    [itemName] NVARCHAR(255),
    [customerName] NVARCHAR(255),
    [supplyType] NVARCHAR(255),
    [account] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [itemPrice] NVARCHAR(255),
    [itemTax] NVARCHAR(255),
    [itemTaxRate] NVARCHAR(255),
    [total] NVARCHAR(255),
    [costcentre] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [voucherType] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [itemTaxType] NVARCHAR(255),
    [hsnsac] NVARCHAR(20),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [invoicestatus] NVARCHAR(255),
    [notes] NVARCHAR(255),
    [referenceinvoicetype] NVARCHAR(255),
    [tds] NVARCHAR(255),
    [tcs] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_journal] (
    [date] NVARCHAR(255),
    [journalNumberPrefix] NVARCHAR(255),
    [journalNumberSuffix] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [account] NVARCHAR(255),
    [notes] NVARCHAR(max),
    [debit] NVARCHAR(255),
    [credit] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [contactname] NVARCHAR(255),
    [journaltype] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [reportingtag] NVARCHAR(max),
    [status] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [lastupdatedtimestamp] NVARCHAR(255),
    [addeduser] NVARCHAR(255),
    [modifieduser] NVARCHAR(255),
    [description] NVARCHAR(max),
    [sourcecreatedby] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_manual] (
    [date] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [voucherType] NVARCHAR(255),
    [voucherNo] NVARCHAR(255),
    [ledger] NVARCHAR(255),
    [costCentre] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [partyLedger] NVARCHAR(255),
    [narration] NVARCHAR(max),
    [lineItemNarration] NVARCHAR(max),
    [stockitem] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [rate] NVARCHAR(255),
    [gstRate] NVARCHAR(255),
    [type] NVARCHAR(255),
    [agstRefNo] NVARCHAR(255),
    [paidThrough] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [tagname] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[tzm_vendor_payment] (
    [date] NVARCHAR(255),
    [paymentNumber] NVARCHAR(255),
    [vendorName] NVARCHAR(255),
    [paidThrough] NVARCHAR(255),
    [description] NVARCHAR(max),
    [amount] NVARCHAR(255),
    [branch] NVARCHAR(255),
    [voucherkey] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [synctimestamp] NVARCHAR(255),
    [companyid] NVARCHAR(255),
    [companyname] NVARCHAR(255),
    [paymenttype] NVARCHAR(255),
    [tallyvoucherkey] NVARCHAR(255),
    [tallyvouchernumber] NVARCHAR(255),
    [prefix] NVARCHAR(255),
    [suffix] NVARCHAR(255),
    [mode] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[user_1] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    [lname] NVARCHAR(max),
    CONSTRAINT [PK__user_1__DE105D07317B5E94] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[user_master] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(max),
    [age] NVARCHAR(max),
    CONSTRAINT [PK__user_mas__DE105D072B850B8E] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[user1] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [fname] NVARCHAR(max),
    [age] NVARCHAR(max),
    [lname] NVARCHAR(max),
    [address] NVARCHAR(max),
    CONSTRAINT [PK__user1__DE105D070E69AB54] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[userBotMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [userID] INT,
    [userName] NVARCHAR(max),
    [emailID] NVARCHAR(max),
    [bot] NVARCHAR(max),
    [addedUser] NVARCHAR(max),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(max),
    [modifiedTime] DATETIME2,
    CONSTRAINT [PK__userBotM__DE105D07C835D067] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[userDetail] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(max),
    [email] NVARCHAR(255) NOT NULL,
    [dob] DATE,
    [age] NVARCHAR(255),
    [gender] NVARCHAR(255),
    [password] NVARCHAR(max),
    [addedTime] DATE,
    [addedUser] NVARCHAR(255),
    [activeUser] NVARCHAR(255),
    CONSTRAINT [PK__userDeta__DE105D0779FB9343] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__userDeta__AB6E61645A8F4164] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[userEntityMaster] (
    [userID] INT,
    [emailID] NVARCHAR(255) NOT NULL,
    [userName] NVARCHAR(255),
    [companyID] INT,
    [companyName] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(255) NOT NULL,
    [client] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [gender] NVARCHAR(255),
    [profileImage] NVARCHAR(max),
    [department] NVARCHAR(max),
    [lid] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__userEnti__DE105D078AB436D9] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[userMaster] (
    [userID] INT NOT NULL,
    [emailID] NVARCHAR(255) NOT NULL,
    [userName] NVARCHAR(255),
    [password] NVARCHAR(255),
    [role] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyID] INT,
    [mobile] NVARCHAR(255),
    [country] NVARCHAR(255),
    [client] NVARCHAR(255),
    [subscriptionPlan] NVARCHAR(255),
    [expiryDate] DATETIME2,
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [gender] NVARCHAR(255),
    [profileImage] NVARCHAR(max),
    [department] NVARCHAR(max),
    [status] NVARCHAR(255),
    CONSTRAINT [PK__userMast__CB9A1CDFC106BD53] PRIMARY KEY CLUSTERED ([userID])
);

-- CreateTable
CREATE TABLE [dbo].[vendorMasterTemp] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyName] NVARCHAR(255),
    [companyId] NVARCHAR(255),
    [vendorName] NVARCHAR(255),
    [gstin] NVARCHAR(255),
    [address] NVARCHAR(1000),
    [stateName] NVARCHAR(255),
    [stateCode] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [service] NVARCHAR(955),
    CONSTRAINT [PK__vendorMa__DE105D07C9186BBC] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[vendorNatureMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [vendorNature] VARCHAR(555),
    [vendorCategory] VARCHAR(555),
    [tdsApplicability] VARCHAR(555),
    [tdsSection] VARCHAR(555),
    [isRcmNature] VARCHAR(555),
    CONSTRAINT [PK__vendorNa__DE105D073A7325FF] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[vendorPortal] (
    [companyId] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [bookingSource] NVARCHAR(255),
    [bookingDate] NVARCHAR(255),
    [pnr] NVARCHAR(255),
    [alternativePnr] NVARCHAR(255),
    [particulars] NVARCHAR(255),
    [baseCurrency] NVARCHAR(255),
    [debit] NVARCHAR(255),
    [credit] NVARCHAR(255),
    [net] NVARCHAR(255),
    [runningbalance] NVARCHAR(255),
    [departureDate] NVARCHAR(255),
    [passengerName] NVARCHAR(255),
    [tax] NVARCHAR(255),
    [bookingCurrency] NVARCHAR(255),
    [fcAmount] NVARCHAR(255),
    [fxRate] NVARCHAR(255),
    [recoid] NVARCHAR(255),
    [zbid] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [recotag] NVARCHAR(255),
    [recostatus] NVARCHAR(255),
    [booksid] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[vendorStatementExt] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [RECOSTATAUS] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [tags] NVARCHAR(255),
    [reference] NVARCHAR(max),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[vouchers_joined] (
    [date] NVARCHAR(255),
    [guid] NVARCHAR(255),
    [gstregnType] NVARCHAR(255),
    [partyGstin] NVARCHAR(255),
    [voucherKey] NVARCHAR(255),
    [recordTime] NVARCHAR(255),
    [interOrIntra] NVARCHAR(255),
    [voucherType] NVARCHAR(255),
    [voucherNo] NVARCHAR(255),
    [ledger] NVARCHAR(255),
    [costCentre] NVARCHAR(255),
    [amount] NVARCHAR(255),
    [partyLedger] NVARCHAR(255),
    [narration] NVARCHAR(255),
    [lineItemNarration] NVARCHAR(255),
    [stockitem] NVARCHAR(255),
    [quantity] NVARCHAR(255),
    [rate] NVARCHAR(255),
    [gstRate] NVARCHAR(255),
    [type] NVARCHAR(255),
    [agstRefNo] NVARCHAR(255),
    [paidThrough] NVARCHAR(255),
    [jsonRef] NVARCHAR(255),
    [tag] NVARCHAR(255),
    [drsTrn] NVARCHAR(255),
    [crTrn] NVARCHAR(255),
    [bankTrn] NVARCHAR(255),
    [gstOutTrn] NVARCHAR(255),
    [gstInwTrn] NVARCHAR(255),
    [tdsPaTrn] NVARCHAR(255),
    [saleTrn] NVARCHAR(255),
    [purTrn] NVARCHAR(255),
    [cashTrn] NVARCHAR(255),
    [identifiedDr] NVARCHAR(255),
    [identifiedCr] NVARCHAR(255),
    [crordr] NVARCHAR(255),
    [drsDrTrn] NVARCHAR(255),
    [drsCrTrn] NVARCHAR(255),
    [crsDrTrn] NVARCHAR(255),
    [crsCrTrn] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[wallets] (
    [TRANDATE] DATE,
    [SETTLEMENTDATE] DATE,
    [PARTICULARS] NVARCHAR(max),
    [DESCRIPTION] NVARCHAR(max),
    [OPENINGBALANCE] NVARCHAR(255),
    [INCREASE] NVARCHAR(255),
    [DECREASE] NVARCHAR(255),
    [CLOSINGBALANCE] NVARCHAR(255),
    [CLOSINGBALANCERECOMPUTED] NVARCHAR(255),
    [PARTYNAME] NVARCHAR(255),
    [COA] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [RECONAME] NVARCHAR(255),
    [RECOID] NVARCHAR(255),
    [recostatus] NVARCHAR(255),
    [RECOTAG] NVARCHAR(255),
    [ZBID] NVARCHAR(255),
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYNAME] NVARCHAR(255),
    [COMPANYID] NVARCHAR(255),
    [ADDEDTIME] NVARCHAR(255),
    [MODIFIEDTIME] NVARCHAR(255),
    [DATASOURCE] NVARCHAR(255),
    [ADDEDUSER] NVARCHAR(255),
    [MODIFEDUSER] NVARCHAR(255),
    [batchno] INT,
    [sno] INT,
    [tags] NVARCHAR(255),
    [grossamount] NVARCHAR(255),
    [currency] NVARCHAR(255),
    [fcamount] NVARCHAR(255),
    [ded1] NVARCHAR(255),
    [ded2] NVARCHAR(255),
    [ded3] NVARCHAR(255),
    [reference] NVARCHAR(max),
    [net] NVARCHAR(255),
    [ISREDFLAG] BIT,
    [ISVALIDATED] BIT
);

-- CreateTable
CREATE TABLE [dbo].[window_verifiedEmail] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(255),
    [expiry] DATETIME2,
    [status] NVARCHAR(20),
    CONSTRAINT [PK__window_v__DE105D0777E78FEE] PRIMARY KEY CLUSTERED ([lid]),
    CONSTRAINT [UQ__window_v__AB6E616423F39E60] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[workflows] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] INT,
    [companyName] VARCHAR(255),
    [appId] VARCHAR(255),
    [formName] VARCHAR(255),
    [workflowType] VARCHAR(255),
    [properties] NVARCHAR(max),
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    CONSTRAINT [PK__workflow__DE105D0784507302] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[Zohoaccounttransactionsync] (
    [date] VARCHAR(255),
    [account_name] VARCHAR(255),
    [transaction_details] VARCHAR(255),
    [transaction_id] VARCHAR(255),
    [reference_transaction_id] VARCHAR(255),
    [offset_account_id] VARCHAR(255),
    [offset_account_type] VARCHAR(255),
    [transaction_type] VARCHAR(255),
    [reference_number] VARCHAR(255),
    [entity_number] VARCHAR(255),
    [debit] VARCHAR(255),
    [credit] VARCHAR(255),
    [net] VARCHAR(255),
    [net_amount] VARCHAR(255),
    [contact_id] VARCHAR(255),
    [account_id] VARCHAR(255),
    [project_ids] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [account] NVARCHAR(max),
    [account_group] VARCHAR(255),
    [account_type] VARCHAR(255),
    [reporting_tag] VARCHAR(255),
    [branch] NVARCHAR(max),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[zohoAllVouchers] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [tranDate] VARCHAR(555),
    [accountName] VARCHAR(555),
    [transactionDetails] VARCHAR(555),
    [transactionId] VARCHAR(555),
    [offsetAccountId] VARCHAR(555),
    [offsetAccountType] VARCHAR(555),
    [transactionType] VARCHAR(555),
    [referenceNumber] VARCHAR(555),
    [netAmount] VARCHAR(555),
    [contactId] VARCHAR(555),
    [accountId] VARCHAR(555),
    [accountGroup] VARCHAR(555),
    [accountType] VARCHAR(555),
    [currencyCode] VARCHAR(555),
    CONSTRAINT [PK__zohoAllV__DE105D077199FF39] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[Zohobankaccountssync] (
    [account_id] VARCHAR(255),
    [account_name] VARCHAR(255),
    [currency_id] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [account_type] VARCHAR(255),
    [uncategorized_transactions] VARCHAR(255),
    [is_active] VARCHAR(255),
    [balance] VARCHAR(255),
    [bank_name] VARCHAR(255),
    [routing_number] VARCHAR(255),
    [is_primary_account] VARCHAR(255),
    [is_paypal_account] VARCHAR(255),
    [paypal_email_address] VARCHAR(255),
    [account_number] VARCHAR(255),
    [description] VARCHAR(255),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255),
    [statement_suggestion_count] NVARCHAR(max),
    [account_code] VARCHAR(max),
    [total_unprinted_checks] VARCHAR(max),
    [bank_balance] VARCHAR(max),
    [bcy_balance] VARCHAR(max),
    [feeds_last_refresh_date] VARCHAR(max),
    [is_direct_paypal] VARCHAR(max),
    [partner_bank_source_formatted] VARCHAR(max),
    [partner_bank_source] VARCHAR(max),
    [is_beta_feed] VARCHAR(max),
    [feed_status] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[Zohobanktransactionssync] (
    [transaction_id] VARCHAR(255),
    [debit_or_credit] VARCHAR(255),
    [date] VARCHAR(255),
    [customer_id] VARCHAR(255),
    [payee] VARCHAR(255),
    [reference_number] VARCHAR(255),
    [transaction_type] VARCHAR(255),
    [amount] VARCHAR(255),
    [status] VARCHAR(255),
    [source] VARCHAR(255),
    [account_id] VARCHAR(255),
    [currency_id] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [offset_account_name] VARCHAR(255),
    [imported_transaction_id] VARCHAR(255),
    [from_account_id] VARCHAR(255),
    [from_account_name] VARCHAR(255),
    [to_account_id] VARCHAR(255),
    [to_account_name] VARCHAR(255),
    [payment_mode] VARCHAR(255),
    [exchange_rate] VARCHAR(255),
    [customer_name] VARCHAR(255),
    [description] VARCHAR(255),
    [status_formatted] VARCHAR(255),
    [associated_transactions] VARCHAR(255),
    [categorized_transaction_id] VARCHAR(255),
    [transaction_date] VARCHAR(255),
    [transaction_type_formatted] VARCHAR(255),
    [entry_number] VARCHAR(255),
    [reconcile_status] VARCHAR(255),
    [debit_amount] VARCHAR(255),
    [credit_amount] VARCHAR(255),
    [transaction_status] VARCHAR(255),
    [transaction_status_formatted] VARCHAR(255),
    [transaction_source] VARCHAR(255),
    [account_name] VARCHAR(255),
    [account_type] VARCHAR(255),
    [price_precision] VARCHAR(255),
    [currency_symbol] VARCHAR(255),
    [imported_transactions] VARCHAR(255),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[ZohoBills] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [BILLID] VARCHAR(555),
    [VENDORID] VARCHAR(555),
    [VENDORNAME] VARCHAR(555),
    [BILLNUMBER] VARCHAR(555),
    [REFNUMBER] VARCHAR(555),
    [DATE] DATETIME2,
    [CURRENCY] VARCHAR(555),
    [TOTAL] DECIMAL(12,2),
    [DUEDATE] DATETIME2,
    [SYNCTIMESTAMP] NVARCHAR(255),
    CONSTRAINT [PK__ZohoBill__DE105D07EA8F2603] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[zohobillslineitems] (
    [BILLID] NVARCHAR(255),
    [VENDORID] NVARCHAR(255),
    [VENDORNAME] NVARCHAR(255),
    [BILLNUMBER] NVARCHAR(255),
    [REFNUMBER] NVARCHAR(255),
    [TRANDATE] DATETIME,
    [CURRENCY] NVARCHAR(255),
    [LINEITEMID] NVARCHAR(255),
    [DUEDATE] DATETIME,
    [ITEMID] NVARCHAR(255),
    [SKU] NVARCHAR(255),
    [NAME] NVARCHAR(255),
    [ACCOUNTID] NVARCHAR(255),
    [ACCOUNTNAME] NVARCHAR(255),
    [WAREHOUSEID] NVARCHAR(255),
    [WAREHOUSENAME] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [QUANTITY] NVARCHAR(255),
    [ITEMTOTAL] NVARCHAR(255),
    [TAXPERCENT] NVARCHAR(255),
    [TOTALINCLTAX] NVARCHAR(255),
    [TDSRATE] NVARCHAR(255),
    [TDSAMT] NVARCHAR(255),
    [NETPAYABLE] NVARCHAR(255),
    [SOURCEOFSUPPLY] NVARCHAR(255),
    [DESTINATIONOFSUPPLY] NVARCHAR(255),
    [TAXAMOUNT] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(max),
    [ITCELIGIBILITY] NVARCHAR(255),
    [lid] INT NOT NULL IDENTITY(1,1),
    [companyId] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [batchNumber] NVARCHAR(255),
    [dataSource] NVARCHAR(255),
    [addedUser] NVARCHAR(255),
    [addedTime] DATETIME,
    [modifiedUser] NVARCHAR(255),
    [modifiedTime] DATETIME
);

-- CreateTable
CREATE TABLE [dbo].[ZohoBillsSync] (
    [sub_total] VARCHAR(255),
    [tax_total] VARCHAR(255),
    [taxes] VARCHAR(255),
    [payment_made] VARCHAR(255),
    [billing_address] VARCHAR(255),
    [payments] VARCHAR(255),
    [last_modified_time] VARCHAR(255),
    [line_items] VARCHAR(255),
    [reference_id] VARCHAR(255),
    [terms] VARCHAR(255),
    [attachment_name] VARCHAR(255),
    [amount_applied] VARCHAR(255),
    [recurring_bill_id] VARCHAR(255),
    [is_item_level_tax_calc] VARCHAR(255),
    [vendor_credit_bill_id] VARCHAR(255),
    [amount] VARCHAR(255),
    [notes] VARCHAR(255),
    [exchange_rate] VARCHAR(255),
    [price_precision] VARCHAR(255),
    [currency_symbol] VARCHAR(255),
    [bill_id] VARCHAR(255),
    [vendor_id] VARCHAR(255),
    [vendor_name] VARCHAR(255),
    [status] VARCHAR(255),
    [bill_number] VARCHAR(255),
    [reference_number] VARCHAR(255),
    [date] VARCHAR(255),
    [due_date] VARCHAR(255),
    [due_days] VARCHAR(255),
    [currency_id] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [total] VARCHAR(255),
    [balance] VARCHAR(255),
    [created_time] VARCHAR(255),
    [unused_credits_payable_amount] VARCHAR(255),
    [due_by_days] VARCHAR(255),
    [due_in_days] VARCHAR(255),
    [vendor_credit_id] VARCHAR(255),
    [vendor_credit_number] VARCHAR(255),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Zohochartofaccountssync] (
    [account_id] VARCHAR(255),
    [account_name] VARCHAR(255),
    [account_type] VARCHAR(255),
    [is_active] VARCHAR(255),
    [is_user_created] VARCHAR(255),
    [is_involved_in_transaction] VARCHAR(255),
    [is_system_account] VARCHAR(255),
    [current_balance] VARCHAR(255),
    [account_type_formatted] VARCHAR(255),
    [description] VARCHAR(255),
    [bank_account_number] VARCHAR(255),
    [currency_id] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [is_mileage] VARCHAR(255),
    [mileage_unit] VARCHAR(255),
    [mileage_rate] VARCHAR(255),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [created_time] VARCHAR(255),
    [last_modified_time] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[zohoContacts] (
    [LID] INT NOT NULL IDENTITY(1,1),
    [COMPANYID] NVARCHAR(100),
    [COMPANYNAME] NVARCHAR(100),
    [CONTACTID] NVARCHAR(100),
    [CONTACTNAME] NVARCHAR(100),
    [ENTITYNAME] NVARCHAR(100),
    [CONTACTTYPE] NVARCHAR(100),
    [PAYMENTTERMS] NVARCHAR(100),
    [CURRENCY] NVARCHAR(100),
    [OUTSTANDING] NVARCHAR(100),
    [UNUSEDCREDIT] NVARCHAR(100),
    [SOURCESYSTEM] NVARCHAR(100),
    [SYNCTIMESTAMP] NVARCHAR(100),
    [LASTMODIFIEDTIME] NVARCHAR(255),
    CONSTRAINT [PK__zohoCont__C6555721AA66084E] PRIMARY KEY CLUSTERED ([LID])
);

-- CreateTable
CREATE TABLE [dbo].[zohoContactsLineItemInfo] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [CONTACTID] VARCHAR(555),
    [GSTIN] VARCHAR(555),
    [PAN] VARCHAR(555),
    CONSTRAINT [PK__zohoCont__DE105D07267C8E8C] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ZOHOCONTPERMINFO] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [CONTACTID] NVARCHAR(255),
    [CONTACTNAME] NVARCHAR(255),
    [CONTACTTYPE] NVARCHAR(255),
    [GSTIN] NVARCHAR(15),
    [PLACEOFCONTACT] NVARCHAR(15),
    [PAN] NVARCHAR(10),
    [UDYAM] NVARCHAR(255),
    [MSMETYPE] NVARCHAR(255),
    [GSTTREATMENT] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Zohoexpensessync] (
    [expense_id] VARCHAR(max),
    [date] VARCHAR(max),
    [account_name] VARCHAR(max),
    [paid_through_account_name] VARCHAR(max),
    [description] VARCHAR(max),
    [currency_id] VARCHAR(max),
    [currency_code] VARCHAR(max),
    [bcy_total] VARCHAR(max),
    [total] VARCHAR(max),
    [is_billable] VARCHAR(max),
    [reference_number] VARCHAR(max),
    [customer_id] VARCHAR(max),
    [customer_name] VARCHAR(max),
    [vendor_id] VARCHAR(max),
    [vendor_name] VARCHAR(max),
    [status] VARCHAR(max),
    [created_time] VARCHAR(max),
    [expense_receipt_name] VARCHAR(max),
    [expense_item_id] VARCHAR(max),
    [account_id] VARCHAR(max),
    [paid_through_account_id] VARCHAR(max),
    [tax_id] VARCHAR(max),
    [tax_name] VARCHAR(max),
    [tax_percentage] VARCHAR(max),
    [exchange_rate] VARCHAR(max),
    [tax_amount] VARCHAR(max),
    [sub_total] VARCHAR(max),
    [amount] VARCHAR(max),
    [is_inclusive_tax] VARCHAR(max),
    [last_modified_time] VARCHAR(max),
    [invoice_id] VARCHAR(max),
    [invoice_number] VARCHAR(max),
    [project_id] VARCHAR(max),
    [project_name] VARCHAR(max),
    [recurring_expense_id] VARCHAR(max),
    [organization_id] VARCHAR(max),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[zohoinvoices] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [INVOICEID] NVARCHAR(255),
    [CUSTOMERID] NVARCHAR(255),
    [CUSTOMERNAME] NVARCHAR(255),
    [ENTITYNAME] NVARCHAR(255),
    [INVOICENO] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [DUEDATE] NVARCHAR(255),
    [CREATEDBY] NVARCHAR(255),
    [INVTOTAL] NVARCHAR(255),
    [INVCREATETIME] NVARCHAR(255),
    [INVMODTIME] NVARCHAR(255),
    [CURRENCYID] NVARCHAR(255),
    [CURRENCY] NVARCHAR(255),
    [INVOICEURL] NVARCHAR(255),
    [EXCHGRATE] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [FY] NVARCHAR(9),
    [ISLINEITEM] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[zohoinvoiceslineitems] (
    [COMPANYID] NVARCHAR(255),
    [COMPANYNAME] NVARCHAR(255),
    [INVOICEID] NVARCHAR(255),
    [INVOICENUMBER] NVARCHAR(255),
    [INVOICEDATE] NVARCHAR(255),
    [CUSTOMERID] NVARCHAR(255),
    [CUSTOMERNAME] NVARCHAR(255),
    [CURRENCYID] NVARCHAR(255),
    [CURRENCYCODE] NVARCHAR(255),
    [PLACEOFSUPPLY] NVARCHAR(255),
    [LINEITEMID] NVARCHAR(255),
    [ITEMID] NVARCHAR(255),
    [PRODUCTTYPE] NVARCHAR(255),
    [ITEMNAME] NVARCHAR(255),
    [DESCRIPTION] NVARCHAR(max),
    [QUANTITY] NVARCHAR(255),
    [DISCOUNT] NVARCHAR(255),
    [BASECURRENCYRATE] NVARCHAR(255),
    [RATE] NVARCHAR(255),
    [ACCOUNTNAME] NVARCHAR(255),
    [TAXID] NVARCHAR(255),
    [TAXNAME] NVARCHAR(255),
    [TAXTYPE] NVARCHAR(255),
    [TAXPERCENT] NVARCHAR(255),
    [ITEMTOTAL] NVARCHAR(255),
    [HSNSAC] NVARCHAR(255),
    [TDSPERCENT] NVARCHAR(255),
    [TDSAMOUNT] NVARCHAR(255),
    [GSTAMOUNT] NVARCHAR(255),
    [SYNCTIMESTAMP] NVARCHAR(255),
    [FY] NVARCHAR(255),
    [BASICAMOUNT] NVARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[zohoItemsMaster] (
    [lid] INT NOT NULL IDENTITY(1,1),
    [batchNo] INT,
    [addedTime] DATETIME2,
    [addedUser] NVARCHAR(255),
    [modifiedTime] DATETIME2,
    [modifiedUser] NVARCHAR(255),
    [companyName] NVARCHAR(255),
    [companyId] INT,
    [ITEMID] VARCHAR(555),
    [ITEMNAME] VARCHAR(555),
    [DESCRIPTION] VARCHAR(555),
    [RATE] VARCHAR(555),
    [UNIT] VARCHAR(555),
    [TAXPERCENT] VARCHAR(555),
    [SKU] VARCHAR(555),
    [PRODUCTTYPE] VARCHAR(555),
    CONSTRAINT [PK__zohoItem__DE105D07D8F4496A] PRIMARY KEY CLUSTERED ([lid])
);

-- CreateTable
CREATE TABLE [dbo].[ZohoOrganizationsync] (
    [clientID] VARCHAR(max),
    [organization_id] VARCHAR(255),
    [name] VARCHAR(255),
    [contact_name] VARCHAR(255),
    [email] VARCHAR(255),
    [is_default_org] VARCHAR(255),
    [plan_type] VARCHAR(255),
    [tax_group_enabled] VARCHAR(255),
    [plan_name] VARCHAR(255),
    [plan_period] VARCHAR(255),
    [language_code] VARCHAR(255),
    [fiscal_year_start_month] VARCHAR(255),
    [account_created_date] VARCHAR(255),
    [account_created_date_formatted] VARCHAR(255),
    [time_zone] VARCHAR(255),
    [is_org_active] VARCHAR(255),
    [currency_id] VARCHAR(255),
    [currency_code] VARCHAR(255),
    [currency_symbol] VARCHAR(255),
    [currency_format] VARCHAR(255),
    [price_precision] VARCHAR(255),
    [date_format] VARCHAR(255),
    [field_separator] VARCHAR(255),
    [industry_type] VARCHAR(255),
    [industry_size] VARCHAR(255),
    [company_id_label] VARCHAR(255),
    [company_id_value] VARCHAR(255),
    [tax_id_label] VARCHAR(255),
    [tax_id_value] VARCHAR(255),
    [address] VARCHAR(max),
    [org_address] VARCHAR(255),
    [remit_to_address] VARCHAR(255),
    [phone] VARCHAR(255),
    [fax] VARCHAR(255),
    [website] VARCHAR(255),
    [tax_basis] VARCHAR(255),
    [is_logo_uploaded] VARCHAR(255),
    [user_role] VARCHAR(255),
    [user_status] VARCHAR(255),
    [unverified_email] VARCHAR(255),
    [is_transaction_available] VARCHAR(255),
    [show_org_address_as_one_field] VARCHAR(255),
    [companyid_label] VARCHAR(255),
    [companyid_value] VARCHAR(255),
    [taxid_label] VARCHAR(255),
    [taxid_value] VARCHAR(255),
    [value] VARCHAR(255),
    [source] VARCHAR(255),
    [version] VARCHAR(255),
    [is_trial_expired] VARCHAR(255),
    [role_id] VARCHAR(255),
    [is_trial_period_extended] VARCHAR(255),
    [custom_fields] VARCHAR(max),
    [is_new_customer_custom_fields] VARCHAR(255),
    [is_portal_enabled] VARCHAR(255),
    [portal_name] VARCHAR(255),
    [is_registered_for_tax] VARCHAR(255),
    [tax_payment_period] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateTable
CREATE TABLE [dbo].[Zohovendorpaymentssync] (
    [payment_id] VARCHAR(255),
    [vendor_id] VARCHAR(255),
    [vendor_name] VARCHAR(255),
    [payment_mode] VARCHAR(255),
    [description] VARCHAR(255),
    [date] VARCHAR(255),
    [reference_number] VARCHAR(255),
    [exchange_rate] VARCHAR(255),
    [amount] VARCHAR(255),
    [paid_through_account_id] VARCHAR(255),
    [paid_through_account_name] VARCHAR(255),
    [balance] VARCHAR(255),
    [currency_symbol] VARCHAR(255),
    [bills] VARCHAR(255),
    [organization_id] VARCHAR(255),
    [clientID] VARCHAR(255),
    [SOURCESYSTEM] VARCHAR(255)
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_coamapped_coid_name_lid] ON [dbo].[COA_mapped]([COMPANYID], [NAME], [lid]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_EMAIL] ON [dbo].[SYF_USERMASTER]([EMAIL]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_RESET_TOKEN] ON [dbo].[SYF_USERMASTER]([resetToken]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_VERIFICATION_TOKEN] ON [dbo].[SYF_USERMASTER]([emailVerificationToken]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_name] ON [dbo].[tbl_tallyprime_LedgerMasters]([NAME]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_tb_coid_period_fromandtodate] ON [dbo].[tbl_tallyprime_TrialBalances]([COMPANYID], [PERIOD], [FROMDATE], [TODATE]);

-- AddForeignKey
ALTER TABLE [dbo].[allDimensions] ADD CONSTRAINT [FK__allDimens__compa__64B7E415] FOREIGN KEY ([companyID]) REFERENCES [dbo].[companyMaster]([companyID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[allDimensions] ADD CONSTRAINT [FK__allDimens__userI__63C3BFDC] FOREIGN KEY ([userID]) REFERENCES [dbo].[userMaster]([userID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AllObservations] ADD CONSTRAINT [FK_AllObservations_AllProjects] FOREIGN KEY ([ProjectCode]) REFERENCES [dbo].[AllProjects]([ProjectCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[appAssets_report] ADD CONSTRAINT [FK__appAssets__formI__2077C861] FOREIGN KEY ([formID]) REFERENCES [dbo].[appAssets_form]([lid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[appAssets_subHead] ADD CONSTRAINT [FK__appAssets__headI__4979DDF4] FOREIGN KEY ([headID]) REFERENCES [dbo].[appAssets_head]([lid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[companyMaster] ADD CONSTRAINT [FK__companyMa__userI__58520D30] FOREIGN KEY ([userID]) REFERENCES [dbo].[userMaster]([userID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Entries] ADD CONSTRAINT [FK__Entries__SCID__39788055] FOREIGN KEY ([SCID]) REFERENCES [dbo].[SubCategories]([SCID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Milestones] ADD CONSTRAINT [FK__Milestone__assig__10615C29] FOREIGN KEY ([assignmentNatureID]) REFERENCES [dbo].[AssignmentNature]([lid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RecoTableA] ADD CONSTRAINT [FK__RecoTable__UserI__07220AB2] FOREIGN KEY ([UserID]) REFERENCES [dbo].[tblUserDetails]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RecoTableB] ADD CONSTRAINT [FK__RecoTable__UserI__090A5324] FOREIGN KEY ([UserID]) REFERENCES [dbo].[tblUserDetails]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[roles] ADD CONSTRAINT [fk_roles_usermaster] FOREIGN KEY ([userid]) REFERENCES [dbo].[SYF_USERMASTER]([LID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SubCategories] ADD CONSTRAINT [FK__SubCategori__CID__369C13AA] FOREIGN KEY ([CID]) REFERENCES [dbo].[Categories]([CID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[subEntries] ADD CONSTRAINT [FK__subEntries__EID__44EA3301] FOREIGN KEY ([EID]) REFERENCES [dbo].[Entries]([EID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SYF_COMPANYMASTER] ADD CONSTRAINT [FK__SYF_COMPA__USERI__75435199] FOREIGN KEY ([USERID]) REFERENCES [dbo].[SYF_USERMASTER]([LID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tbl_tallyprime_CompanyMasters] ADD CONSTRAINT [fk_syfCompanyMaster_companyId] FOREIGN KEY ([COMPANYIDACBKMASTER]) REFERENCES [dbo].[SYF_COMPANYMASTER]([lid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[templateBuilder] ADD CONSTRAINT [FK__templateB__tempI__7E77B618] FOREIGN KEY ([tempId]) REFERENCES [dbo].[financial_templateMaster]([tempId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[templateHeadings] ADD CONSTRAINT [FK__templateH__tempI__024846FC] FOREIGN KEY ([tempId]) REFERENCES [dbo].[financial_templateMaster]([tempId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[templateTransaction] ADD CONSTRAINT [FK__templateT__tempI__5B0E7E4A] FOREIGN KEY ([tempID]) REFERENCES [dbo].[templateMaster]([lid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userEntityMaster] ADD CONSTRAINT [FK__userEntit__compa__5C229E14] FOREIGN KEY ([companyID]) REFERENCES [dbo].[companyMaster]([companyID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userEntityMaster] ADD CONSTRAINT [FK__userEntit__userI__5B2E79DB] FOREIGN KEY ([userID]) REFERENCES [dbo].[userMaster]([userID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

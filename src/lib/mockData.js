const MOCK_STORAGE_KEY = "task-management-mock-data";
const MOCK_SCHEMA_VERSION = 3;

export const demoAccounts = [
  {
    email: "employee@demo.com",
    password: "demo123",
    label: "موظف عادي",
    role: "employee",
    position: { id: 6, ar_name: "موظف", en_name: "Employee" },
  },
  {
    email: "section.manager@demo.com",
    password: "demo123",
    label: "مدير قسم",
    role: "section_manager",
    position: { id: 7, ar_name: "مدير قسم", en_name: "Section Manager" },
  },
  {
    email: "branch.manager@demo.com",
    password: "demo123",
    label: "مدير فرع",
    role: "branch_manager",
    position: { id: 8, ar_name: "مدير فرع", en_name: "Branch Manager" },
  },
  {
    email: "admin@demo.com",
    password: "demo123",
    label: "مدير النظام",
    role: "admin",
    position: { id: 11, ar_name: "مدير النظام", en_name: "System Administrator" },
  },
];

const defaultData = {
  branches: [
    { id: 1, ar_name: "الفرع الرئيسي", en_name: "Head Office" },
    { id: 2, ar_name: "فرع الشمال", en_name: "North Branch" },
  ],
  sections: [
    { id: 1, branch_id: 1, ar_name: "تقنية المعلومات", en_name: "Information Technology" },
    { id: 2, branch_id: 1, ar_name: "الموارد البشرية", en_name: "Human Resources" },
    { id: 3, branch_id: 2, ar_name: "العمليات", en_name: "Operations" },
  ],
  positions: [
    { id: 6, ar_name: "موظف", en_name: "Employee", role: "employee" },
    { id: 7, ar_name: "مدير قسم", en_name: "Section Manager", role: "section_manager" },
    { id: 8, ar_name: "مدير فرع", en_name: "Branch Manager", role: "branch_manager" },
    { id: 11, ar_name: "مدير النظام", en_name: "System Administrator", role: "admin" },
  ],
  users: [
    { id: 100, name: "أحمد محمد", email: "employee@demo.com", role: "employee", position_id: 6, branch_id: 1, section_id: 1, account_status: "active" },
    { id: 101, name: "سارة علي", email: "sara@demo.com", role: "employee", position_id: 6, branch_id: 1, section_id: 2, account_status: "active" },
    { id: 102, name: "مدير قسم التقنية", email: "section.manager@demo.com", role: "section_manager", position_id: 7, branch_id: 1, section_id: 1, account_status: "active" },
    { id: 103, name: "مدير فرع الشمال", email: "branch.manager@demo.com", role: "branch_manager", position_id: 8, branch_id: 2, section_id: 3, account_status: "active" },
    { id: 1, name: "مدير النظام", email: "admin@demo.com", role: "admin", position_id: 11, branch_id: 1, section_id: 1, account_status: "active" },
  ],
  projects: [
    {
      id: 1,
      name_ar: "تطوير منصة إدارة المهام",
      name_en: "Task Management Platform",
      description_ar: "مشروع تجريبي لعرض إمكانيات النظام.",
      description_en: "A demo project showcasing the system features.",
      status: "in_progress",
      is_active: true,
      project_color: "#2563eb",
      branch_id: 1,
      section_id: 1,
      start_date: "2026-01-15",
      expected_expired_date: "2026-12-31",
      tasks: [],
    },
    {
      id: 2,
      name_ar: "تحسين تجربة المستخدم",
      name_en: "User Experience Improvements",
      description_ar: "مهام تحسين الواجهات وسهولة الاستخدام.",
      description_en: "Tasks for improving usability and interfaces.",
      status: "starting_soon",
      is_active: true,
      project_color: "#0f766e",
      branch_id: 2,
      section_id: 3,
      start_date: "2026-04-01",
      expected_expired_date: "2026-08-30",
      tasks: [],
    },
  ],
  tasks: [
    {
      id: 1,
      project_id: 1,
      title_ar: "تصميم لوحة التحكم",
      title_en: "Design the dashboard",
      description_ar: "إعداد التصميم الأولي للوحة التحكم.",
      description_en: "Prepare the initial dashboard design.",
      task_status: "in_progress",
      priority: "high",
      status_approval: "approved",
      assigned_id: 100,
      created_by_id: 100,
      branch_id: 1,
      section_id: 1,
      assigned_user: { id: 100, name: "أحمد محمد" },
      due_date: "2026-06-15",
    },
    {
      id: 2,
      project_id: 1,
      title_ar: "اختبار تسجيل الدخول",
      title_en: "Test login flow",
      description_ar: "التحقق من أدوار المستخدمين ومسار الدخول.",
      description_en: "Verify user roles and the login flow.",
      task_status: "pending",
      priority: "medium",
      status_approval: "pending",
      assigned_id: 101,
      created_by_id: 100,
      branch_id: 1,
      section_id: 2,
      assigned_user: { id: 101, name: "سارة علي" },
      due_date: "2026-07-01",
    },
    {
      id: 3,
      project_id: 2,
      title_ar: "مراجعة النصوص العربية",
      title_en: "Review Arabic copy",
      description_ar: "مراجعة النصوص الظاهرة للمستخدم.",
      description_en: "Review user-facing copy.",
      task_status: "completed",
      priority: "low",
      status_approval: "approved",
      assigned_id: 100,
      created_by_id: 101,
      branch_id: 2,
      section_id: 3,
      assigned_user: { id: 100, name: "أحمد محمد" },
      due_date: "2026-05-20",
    },
  ],
};

function buildExpandedTasks() {
  const templates = [
    ["تحليل المتطلبات", "Requirements analysis", "high", "in_progress"],
    ["إعداد التصميم الأولي", "Prepare initial design", "high", "pending"],
    ["تنفيذ الحل", "Implement the solution", "medium", "pending"],
    ["اختبار الجودة", "Quality assurance testing", "medium", "pending"],
    ["توثيق وتسليم العمل", "Document and hand over", "low", "pending"],
  ];
  const usersByProject = { 1: [100, 101, 102], 2: [101, 103, 100] };
  const tasks = [];
  let nextId = 1000;

  defaultData.projects.forEach((project) => {
    const assignedUsers = usersByProject[project.id] || [100, 101];
    templates.forEach(([titleAr, titleEn, priority, status], index) => {
      const assignedId = assignedUsers[index % assignedUsers.length];
      const assignedUser = defaultData.users.find((user) => user.id === assignedId);
      const taskId = nextId++;
      tasks.push({
        id: taskId,
        project_id: project.id,
        branch_id: project.branch_id,
        section_id: project.section_id,
        title_ar: `${titleAr} - ${project.id}`,
        title_en: `${titleEn} - ${project.id}`,
        description_ar: `مهمة مرتبطة بالمشروع ${project.name_ar}.`,
        description_en: `Task linked to ${project.name_en}.`,
        task_status: index === 0 && project.id === 1 ? "in_progress" : status,
        priority,
        status_approval: index === 0 ? "approved" : "pending",
        assigned_id: assignedId,
        created_by_id: project.id === 1 ? 102 : 103,
        assigned_user: assignedUser,
        type: "task",
        start_date: `2026-${String(5 + index).padStart(2, "0")}-${String(1 + project.id).padStart(2, "0")}`,
        due_date: `2026-${String(6 + index).padStart(2, "0")}-${String(10 + project.id).padStart(2, "0")}`,
        end_date: `2026-${String(6 + index).padStart(2, "0")}-${String(12 + project.id).padStart(2, "0")}`,
        needs_approval: index === 0 ? 1 : 0,
        approved_by_id: index === 0 ? project.id === 1 ? 102 : 103 : null,
        rate: index === 4 ? 100 : 0,
        amount: [2500, 1800, 4200, 1200, 800][index],
        files: [],
      });

      if (index === 1 || index === 3) {
        tasks.push({
          id: nextId++,
          project_id: project.id,
          parent_id: taskId,
          branch_id: project.branch_id,
          section_id: project.section_id,
          title_ar: `${titleAr} - مهمة فرعية`,
          title_en: `${titleEn} - subtask`,
          description_ar: "مهمة فرعية للتجربة والاستيراد.",
          description_en: "A subtask for testing and importing.",
          task_status: index === 3 ? "completed" : "pending",
          priority: "low",
          status_approval: "approved",
          assigned_id: assignedId,
          created_by_id: project.id === 1 ? 102 : 103,
          assigned_user: assignedUser,
          type: "subtask",
          start_date: `2026-${String(5 + index).padStart(2, "0")}-${String(3 + project.id).padStart(2, "0")}`,
          due_date: `2026-${String(6 + index).padStart(2, "0")}-${String(15 + project.id).padStart(2, "0")}`,
          end_date: `2026-${String(6 + index).padStart(2, "0")}-${String(17 + project.id).padStart(2, "0")}`,
          needs_approval: 0,
          approved_by_id: null,
          rate: index === 3 ? 100 : 0,
          amount: 400,
          files: [],
        });
      }
    });
  });
  return tasks;
}

const expandedDefaultData = {
  ...defaultData,
  schemaVersion: MOCK_SCHEMA_VERSION,
  tasks: buildExpandedTasks(),
};

export function getMockData() {
  try {
    const stored = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
    const source = stored?.schemaVersion === MOCK_SCHEMA_VERSION ? stored : expandedDefaultData;
    const data = structuredClone(source);
    const usersById = new Map(data.users.map((user) => [user.id, user]));
    const projectsById = new Map(data.projects.map((project) => [project.id, project]));
    const branchesById = new Map(data.branches.map((branch) => [branch.id, branch]));
    const sectionsById = new Map(data.sections.map((section) => [section.id, section]));
    const positionsById = new Map(data.positions.map((position) => [position.id, position]));

    data.tasks = data.tasks.map((task) => {
      const project = projectsById.get(Number(task.project_id));
      const assignedUser = usersById.get(Number(task.assigned_id));
      const creator = usersById.get(Number(task.created_by_id));
      const approver = usersById.get(Number(task.approved_by_id));
      const branch = branchesById.get(Number(task.branch_id || project?.branch_id));
      const section = sectionsById.get(Number(task.section_id || project?.section_id));
      return {
        type: "task",
        priority: "medium",
        task_status: "pending",
        status_approval: "pending",
        description_ar: "",
        description_en: "",
        title_ar: "مهمة بدون عنوان",
        title_en: "Untitled task",
        start_date: null,
        due_date: null,
        end_date: null,
        needs_approval: 0,
        approved_by_id: null,
        rate: 0,
        amount: 0,
        files: [],
        subtasks: [],
        ...task,
        project,
        branch,
        section,
        position: positionsById.get(Number(assignedUser?.position_id)),
        assigned_user: assignedUser || task.assigned_user,
        created_by: creator,
        approved_by: approver,
      };
    });
    const tasksByParent = new Map();
    data.tasks.forEach((task) => {
      if (task.parent_id) {
        const children = tasksByParent.get(Number(task.parent_id)) || [];
        children.push(task);
        tasksByParent.set(Number(task.parent_id), children);
      }
    });
    data.tasks = data.tasks.map((task) => ({ ...task, subtasks: tasksByParent.get(task.id) || task.subtasks || [] }));
    data.projects = data.projects.map((project) => ({
      ...project,
      branch: branchesById.get(Number(project.branch_id)),
      section: sectionsById.get(Number(project.section_id)),
      tasks: data.tasks.filter((task) => task.project_id === project.id && !task.parent_id),
    }));
    return data;
  } catch {
    return structuredClone(expandedDefaultData);
  }
}

export function saveMockData(data) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function findDemoAccount(email, password) {
  return demoAccounts.find((account) => account.email === email && account.password === password);
}

export function createMockUser(account) {
  const user = getMockData().users.find((item) => item.email === account.email);
  return {
    ...user,
    id: user?.id || (account.role === "admin" ? 1 : account.role === "section_manager" ? 102 : account.role === "branch_manager" ? 103 : 100),
    name: account.label,
    email: account.email,
    role: account.role,
    position: account.position,
    position_id: account.position.id,
    branch_id: user?.branch_id || 1,
    section_id: user?.section_id || 1,
    permissions: account.role === "admin" ? ["*"] : ["task:view", "task:create", "task:edit"],
  };
}

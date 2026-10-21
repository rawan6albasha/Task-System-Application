import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  Clock3,
  FolderKanban,
  ListChecks,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { fetchProjects } from "../../store/slices/projectSlice";
import { fetchTasks } from "../../store/slices/taskSlice";
import ProgressBar from "../../components/shared/ProgressBar";
import { getLocalizedField } from "../../utils/helpers";

const statusConfig = {
  pending: { ar: "قيد الانتظار", en: "Pending", color: "#f59e0b", className: "pending" },
  in_progress: { ar: "قيد التنفيذ", en: "In progress", color: "#2563eb", className: "in-progress" },
  completed: { ar: "مكتملة", en: "Completed", color: "#16a34a", className: "completed" },
  canceled: { ar: "ملغاة", en: "Canceled", color: "#dc2626", className: "canceled" },
  cancelled: { ar: "ملغاة", en: "Canceled", color: "#dc2626", className: "canceled" },
};

const priorityConfig = {
  high: { ar: "عالية", en: "High", color: "#dc2626" },
  medium: { ar: "متوسطة", en: "Medium", color: "#d97706" },
  low: { ar: "منخفضة", en: "Low", color: "#64748b" },
};

function localName(item, field, language) {
  return getLocalizedField(item, field, language) || item?.name || "-";
}

function formatDate(value, language) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function DonutChart({ completed, inProgress, pending, canceled }) {
  const total = completed + inProgress + pending + canceled;
  const completedEnd = total ? (completed / total) * 100 : 0;
  const progressEnd = total ? completedEnd + (inProgress / total) * 100 : 0;
  const pendingEnd = total ? progressEnd + (pending / total) * 100 : 0;
  const background = total
    ? `conic-gradient(#16a34a 0 ${completedEnd}%, #2563eb ${completedEnd}% ${progressEnd}%, #f59e0b ${progressEnd}% ${pendingEnd}%, #dc2626 ${pendingEnd}% 100%)`
    : "conic-gradient(#e2e8f0 0 100%)";

  return (
    <div className="relative h-44 w-44 shrink-0 rounded-full p-4" style={{ background }}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface">
        <span className="text-3xl font-bold text-text">{total}</span>
        <span className="text-xs text-text-muted">إجمالي المهام</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const language = i18n.language === "ar" ? "ar" : "en";
  const isArabic = language === "ar";
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.tasks);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!projects.length) dispatch(fetchProjects());
    if (!tasks.length) dispatch(fetchTasks());
  }, [dispatch, projects.length, tasks.length]);

  const visibleTasks = useMemo(() => {
    const position = Number(currentUser?.position_id);
    if ([9, 10, 11].includes(position) || currentUser?.role === "admin") return tasks;
    if (position === 7 || currentUser?.role === "section_manager") {
      return tasks.filter((task) => Number(task.section_id) === Number(currentUser?.section_id));
    }
    if (position === 8 || currentUser?.role === "branch_manager") {
      return tasks.filter((task) => Number(task.branch_id) === Number(currentUser?.branch_id));
    }
    return tasks.filter((task) => Number(task.assigned_id) === Number(currentUser?.id) || Number(task.created_by_id) === Number(currentUser?.id));
  }, [currentUser, tasks]);

  const visibleProjects = useMemo(() => {
    const projectIds = new Set(visibleTasks.map((task) => Number(task.project_id)));
    return projects.filter((project) => projectIds.has(Number(project.id)) || !visibleTasks.length);
  }, [projects, visibleTasks]);

  const stats = useMemo(() => {
    const completed = visibleTasks.filter((task) => task.task_status === "completed").length;
    const inProgress = visibleTasks.filter((task) => task.task_status === "in_progress").length;
    const pending = visibleTasks.filter((task) => task.task_status === "pending").length;
    const canceled = visibleTasks.filter((task) => ["canceled", "cancelled"].includes(task.task_status)).length;
    const activeProjects = visibleProjects.filter((project) => project.is_active !== false).length;
    const completion = visibleTasks.length ? Math.round((completed / visibleTasks.length) * 100) : 0;
    return { completed, inProgress, pending, canceled, activeProjects, completion };
  }, [visibleProjects, visibleTasks]);

  const upcomingTasks = useMemo(() => visibleTasks
    .filter((task) => task.task_status !== "completed" && task.task_status !== "canceled")
    .sort((a, b) => new Date(a.due_date || "9999-12-31") - new Date(b.due_date || "9999-12-31"))
    .slice(0, 5), [visibleTasks]);

  const projectProgress = useMemo(() => visibleProjects.slice(0, 4).map((project) => {
    const projectTasks = visibleTasks.filter((task) => Number(task.project_id) === Number(project.id));
    const completed = projectTasks.filter((task) => task.task_status === "completed").length;
    return { ...project, taskCount: projectTasks.length, progress: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0 };
  }), [visibleProjects, visibleTasks]);

  const teamPerformance = useMemo(() => {
    const grouped = new Map();
    visibleTasks.forEach((task) => {
      const user = task.assigned_user || { id: task.assigned_id, name: "-" };
      if (!user.id) return;
      const current = grouped.get(user.id) || { user, total: 0, completed: 0, inProgress: 0, pending: 0 };
      current.total += 1;
      if (task.task_status === "completed") current.completed += 1;
      if (task.task_status === "in_progress") current.inProgress += 1;
      if (task.task_status === "pending") current.pending += 1;
      grouped.set(user.id, current);
    });
    return [...grouped.values()].sort((a, b) => (b.completed / b.total) - (a.completed / a.total));
  }, [visibleTasks]);

  const welcomeName = currentUser?.name || (isArabic ? "بك" : "there");
  const labels = {
    welcome: isArabic ? "صباح الخير" : "Good morning",
    overview: isArabic ? "هذه نظرة مركزة على سير العمل اليوم." : "Here is a focused view of your work today.",
    viewTasks: isArabic ? "عرض كل المهام" : "View all tasks",
    newTask: isArabic ? "مهمة جديدة" : "New task",
    projects: isArabic ? "المشاريع النشطة" : "Active projects",
    totalTasks: isArabic ? "إجمالي المهام" : "Total tasks",
    completed: isArabic ? "المهام المكتملة" : "Completed tasks",
    completion: isArabic ? "نسبة الإنجاز" : "Completion rate",
    status: isArabic ? "حالة المهام" : "Task status",
    priorities: isArabic ? "حسب الأولوية" : "By priority",
    upcoming: isArabic ? "المهام القادمة" : "Upcoming tasks",
    projectProgress: isArabic ? "تقدم المشاريع" : "Project progress",
    seeAll: isArabic ? "عرض الكل" : "See all",
    noTasks: isArabic ? "لا توجد مهام قادمة" : "No upcoming tasks",
    noProjects: isArabic ? "لا توجد مشاريع بعد" : "No projects yet",
    tasks: isArabic ? "مهام" : "tasks",
    due: isArabic ? "الاستحقاق" : "Due",
    performance: isArabic ? "أداء الفريق" : "Team performance",
    performanceHint: isArabic ? "الموظفون ضمن نطاق مسؤوليتك فقط" : "Only employees in your responsibility scope",
  };

  const priorityCounts = Object.keys(priorityConfig).map((priority) => ({
    priority,
    count: visibleTasks.filter((task) => task.priority === priority).length,
  }));

  return (
    <div className="space-y-7 pb-8 animate-slideIn">
      <section className="relative overflow-hidden rounded-2xl bg-[#12233f] px-6 py-7 text-white shadow-xl md:px-9 md:py-8">
        <div className="absolute -end-10 -top-16 h-56 w-56 rounded-full border-[24px] border-white/5" />
        <div className="absolute -bottom-24 start-1/3 h-48 w-48 rounded-full border-[20px] border-cyan-300/10" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-200">{labels.welcome}, {welcomeName}</p>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">{labels.overview}</h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/tasks" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#12233f] transition hover:bg-cyan-50">
                <ListChecks size={17} /> {labels.viewTasks}
              </Link>
              <Link to="/tasks" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                <Plus size={17} /> {labels.newTask}
              </Link>
            </div>
          </div>
          <div className="hidden min-w-44 rounded-xl border border-white/15 bg-white/10 p-4 md:block">
            <div className="mb-2 flex items-center justify-between text-xs text-cyan-100"><span>{labels.completion}</span><Target size={16} /></div>
            <p className="text-3xl font-bold">{stats.completion}%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${stats.completion}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: FolderKanban, label: labels.projects, value: stats.activeProjects, note: `${visibleProjects.length} ${labels.projects}`, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: ListChecks, label: labels.totalTasks, value: visibleTasks.length, note: `${stats.inProgress} ${isArabic ? "قيد التنفيذ" : "in progress"}`, color: "text-indigo-600", bg: "bg-indigo-50" },
          { icon: CheckCircle2, label: labels.completed, value: stats.completed, note: `${stats.completion}% ${isArabic ? "من الإجمالي" : "of total"}`, color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Users, label: isArabic ? "فريق العمل" : "Team members", value: teamPerformance.length, note: isArabic ? "ضمن نطاق مسؤوليتك" : "in your scope", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ icon: Icon, label, value, note, color, bg }) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between"><div><p className="text-sm text-text-muted">{label}</p><p className="mt-2 text-3xl font-bold text-text">{value}</p></div><div className={`rounded-lg p-3 ${bg} ${color}`}><Icon size={22} /></div></div>
            <p className="mt-4 text-xs text-text-muted">{note}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold text-text">{labels.status}</h2><p className="mt-1 text-xs text-text-muted">{isArabic ? "توزيع المهام حسب حالتها الحالية" : "Current distribution of your work"}</p></div><BarChart3 className="text-primary" size={22} /></div>
          <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <DonutChart completed={stats.completed} inProgress={stats.inProgress} pending={stats.pending} canceled={stats.canceled} />
            <div className="w-full max-w-xs space-y-3">
              {["completed", "in_progress", "pending", "canceled"].map((status) => { const config = statusConfig[status]; const count = status === "completed" ? stats.completed : status === "in_progress" ? stats.inProgress : status === "pending" ? stats.pending : stats.canceled; return <div key={status} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-text-muted"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: config.color }} />{isArabic ? config.ar : config.en}</span><strong className="text-text">{count}</strong></div>; })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold text-text">{labels.priorities}</h2><p className="mt-1 text-xs text-text-muted">{isArabic ? "المهام التي تحتاج اهتمامًا أولًا" : "Work that needs attention first"}</p></div><CircleAlert className="text-amber-500" size={22} /></div>
          <div className="space-y-5">{priorityCounts.map(({ priority, count }) => { const config = priorityConfig[priority]; const percentage = tasks.length ? (count / tasks.length) * 100 : 0; return <div key={priority}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-text">{isArabic ? config.ar : config.en}</span><span className="text-text-muted">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: config.color }} /></div></div>; })}</div>
          <div className="mt-6 rounded-lg bg-background p-3 text-xs text-text-muted"><Clock3 size={15} className="me-1 inline text-primary" /> {isArabic ? "راجع المهام عالية الأولوية قبل نهاية اليوم." : "Review high-priority tasks before the end of the day."}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold text-text">{labels.upcoming}</h2><p className="mt-1 text-xs text-text-muted">{isArabic ? "أقرب المواعيد التي تستحق المتابعة" : "The nearest deadlines to follow up"}</p></div><Link to="/tasks" className="text-xs font-semibold text-primary hover:underline">{labels.seeAll}</Link></div>
          <div className="divide-y divide-border">{upcomingTasks.length ? upcomingTasks.map((task) => { const status = statusConfig[task.task_status] || statusConfig.pending; const project = projects.find((item) => Number(item.id) === Number(task.project_id)); return <Link to={`/tasks/${task.id}`} key={task.id} className="flex items-center gap-3 py-3 transition hover:bg-background"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarClock size={17} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-text">{localName(task, "title", language)}</p><p className="mt-1 truncate text-xs text-text-muted">{project ? localName(project, "name", language) : "-"}</p></div><div className="text-end"><span className="block text-xs font-semibold" style={{ color: status.color }}>{isArabic ? status.ar : status.en}</span><span className="mt-1 block text-[11px] text-text-muted">{labels.due}: {formatDate(task.due_date, language)}</span></div><ChevronLeft size={16} className="text-text-muted" /></Link>; }) : <div className="py-10 text-center text-sm text-text-muted">{labels.noTasks}</div>}</div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold text-text">{labels.projectProgress}</h2><p className="mt-1 text-xs text-text-muted">{isArabic ? "متابعة إنجاز كل مشروع" : "Track progress across projects"}</p></div><Link to="/projects" className="text-xs font-semibold text-primary hover:underline">{labels.seeAll}</Link></div>
          <div className="space-y-5">{projectProgress.length ? projectProgress.map((project) => <Link to={`/projects/${project.id}`} key={project.id} className="block rounded-lg p-2 transition hover:bg-background"><div className="mb-2 flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold text-text">{localName(project, "name", language)}</span><span className="text-xs font-bold text-primary">{project.progress}%</span></div><ProgressBar value={project.progress} status={project.progress === 100 ? "completed" : project.progress ? "in-progress" : "pending"} /><p className="mt-2 text-[11px] text-text-muted">{project.taskCount} {labels.tasks}</p></Link>) : <div className="py-10 text-center text-sm text-text-muted">{labels.noProjects}</div>}</div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold text-text">{labels.performance}</h2><p className="mt-1 text-xs text-text-muted">{labels.performanceHint}</p></div><BarChart3 className="text-primary" size={22} /></div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{teamPerformance.length ? teamPerformance.map(({ user, total, completed, inProgress, pending }) => { const rate = Math.round((completed / total) * 100); return <div key={user.id} className="rounded-lg border border-border bg-background p-4"><div className="mb-3 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{user.name?.charAt(0) || "-"}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-text">{user.name}</p><p className="text-xs text-text-muted">{total} {labels.tasks}</p></div><span className="ms-auto text-sm font-bold text-primary">{rate}%</span></div><ProgressBar value={rate} status={rate === 100 ? "completed" : "in-progress"} /><div className="mt-3 flex justify-between text-[11px] text-text-muted"><span>{completed} {isArabic ? "مكتملة" : "done"}</span><span>{inProgress} {isArabic ? "جارية" : "active"}</span><span>{pending} {isArabic ? "انتظار" : "pending"}</span></div></div>; }) : <div className="py-8 text-center text-sm text-text-muted">{isArabic ? "لا توجد بيانات أداء ضمن نطاقك" : "No performance data in your scope"}</div>}</div>
      </section>
    </div>
  );
}
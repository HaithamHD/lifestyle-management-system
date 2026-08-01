(() => {
  'use strict';

  const config = window.LIFESTYLE || { page: document.body.dataset.page, apiBase: '/api' };
  const page = config.page || document.body.dataset.page;
  const content = document.getElementById('live-content');
  const toastNode = document.getElementById('toast');
  const modalRoot = document.getElementById('modal-root');

  const state = {
    token: localStorage.getItem('lifestyle_token'),
    user: safeJson(localStorage.getItem('lifestyle_user')),
    tasks: [],
    habits: [],
    journal: [],
  };

  function safeJson(value) {
    try { return value ? JSON.parse(value) : null; } catch (_) { return null; }
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatDate(value, includeTime = false) {
    if (!value) return 'No date';
    const normalized = String(value).includes('T') ? value : `${value}T00:00:00`;
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) return escapeHtml(value);
    return new Intl.DateTimeFormat('en', includeTime
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : { dateStyle: 'medium' }).format(parsed);
  }

  function initials(name = 'User') {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
  }

  function toast(message, type = 'success') {
    if (!toastNode) return;
    toastNode.textContent = message;
    toastNode.className = `lifestyle-toast show${type === 'error' ? ' error' : ''}`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { toastNode.className = 'lifestyle-toast'; }, 3200);
  }

  function saveAuth(payload) {
    state.token = payload.token;
    state.user = payload.user;
    localStorage.setItem('lifestyle_token', payload.token);
    localStorage.setItem('lifestyle_user', JSON.stringify(payload.user));
  }

  function clearAuth() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('lifestyle_token');
    localStorage.removeItem('lifestyle_user');
  }

  async function api(path, options = {}) {
    const headers = {
      Accept: 'application/json',
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${config.apiBase}${path}`, { ...options, headers });
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const payload = response.status === 204 ? null : (isJson ? await response.json() : await response.text());

    if (response.status === 401) {
      clearAuth();
      if (!['login', 'register', 'home'].includes(page)) window.location.href = '/login';
    }

    if (!response.ok) {
      const validation = payload?.errors ? Object.values(payload.errors).flat().join(' ') : null;
      throw new Error(validation || payload?.message || `Request failed (${response.status})`);
    }

    return payload;
  }

  function loading(label = 'Loading your Lifestyle data…') {
    if (!content) return;
    content.innerHTML = `<div class="border border-border rounded-sm p-6 flex items-center gap-3"><span class="lifestyle-spinner"></span><span class="text-sm text-muted-foreground">${escapeHtml(label)}</span></div>`;
  }

  function empty(message) {
    return `<div class="lifestyle-empty">${escapeHtml(message)}</div>`;
  }

  function openModal(title, body, onReady) {
    if (!modalRoot) return;
    modalRoot.innerHTML = `
      <div class="lifestyle-modal-backdrop" data-close-modal>
        <section class="lifestyle-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}" onclick="event.stopPropagation()">
          <header class="px-6 py-5 border-b border-border flex items-center justify-between">
            <div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Lifestyle</p><h2 class="font-display text-2xl font-semibold text-primary">${escapeHtml(title)}</h2></div>
            <button class="w-9 h-9 border border-border rounded-sm" data-close-modal aria-label="Close">✕</button>
          </header>
          <div class="p-6">${body}</div>
        </section>
      </div>`;
    modalRoot.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
    if (onReady) onReady(modalRoot);
  }

  function closeModal() {
    if (modalRoot) modalRoot.innerHTML = '';
  }

  function formObject(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach(key => {
      if (data[key] === '') delete data[key];
    });
    return data;
  }

  function field(label, name, value = '', options = {}) {
    const type = options.type || 'text';
    const required = options.required ? 'required' : '';
    const max = options.max ? `maxlength="${options.max}"` : '';
    const placeholder = options.placeholder ? `placeholder="${escapeHtml(options.placeholder)}"` : '';
    if (options.textarea) {
      return `<label class="block"><span class="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">${escapeHtml(label)}</span><textarea name="${name}" ${required} ${max} ${placeholder} class="w-full min-h-32 border border-border rounded-sm px-4 py-3 text-sm outline-none focus:border-primary">${escapeHtml(value)}</textarea></label>`;
    }
    return `<label class="block"><span class="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">${escapeHtml(label)}</span><input type="${type}" name="${name}" value="${escapeHtml(value)}" ${required} ${max} ${placeholder} class="w-full border border-border rounded-sm px-4 py-3 text-sm outline-none focus:border-primary" /></label>`;
  }

  function selectField(label, name, value, choices) {
    return `<label class="block"><span class="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">${escapeHtml(label)}</span><select name="${name}" class="w-full border border-border rounded-sm px-4 py-3 text-sm bg-white outline-none focus:border-primary">${choices.map(choice => `<option value="${escapeHtml(choice)}" ${choice === value ? 'selected' : ''}>${escapeHtml(choice.replaceAll('_', ' '))}</option>`).join('')}</select></label>`;
  }

  function bindAuth() {
    if (page === 'login') {
      const form = document.getElementById('login-form');
      form?.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const error = document.getElementById('auth-error');
        button.disabled = true;
        const original = button.textContent;
        button.textContent = 'Signing in…';
        error.classList.add('hidden');
        try {
          const payload = formObject(form);
          const result = await api('/login', { method: 'POST', body: JSON.stringify(payload) });
          saveAuth(result);
          window.location.href = result.user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
        } catch (err) {
          error.textContent = err.message;
          error.classList.remove('hidden');
          button.disabled = false;
          button.textContent = original;
        }
      });
    }

    if (page === 'register') {
      const form = document.getElementById('register-form');
      form?.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const error = document.getElementById('auth-error');
        button.disabled = true;
        const original = button.textContent;
        button.textContent = 'Creating account…';
        error.classList.add('hidden');
        try {
          const raw = formObject(form);
          const payload = {
            name: `${raw.first_name || ''} ${raw.last_name || ''}`.trim(),
            email: raw.email,
            password: raw.password,
            password_confirmation: raw.password_confirmation,
          };
          const result = await api('/register', { method: 'POST', body: JSON.stringify(payload) });
          saveAuth(result);
          window.location.href = '/app/dashboard';
        } catch (err) {
          error.textContent = err.message;
          error.classList.remove('hidden');
          button.disabled = false;
          button.textContent = original;
        }
      });
    }
  }

  async function ensureUser() {
    if (!state.token) {
      window.location.href = '/login';
      throw new Error('Authentication required.');
    }
    state.user = await api('/me');
    localStorage.setItem('lifestyle_user', JSON.stringify(state.user));
    document.getElementById('sidebar-user-name').textContent = state.user.name;
    document.getElementById('sidebar-user-email').textContent = state.user.email;
    document.getElementById('user-avatar').textContent = initials(state.user.name);
    if (state.user.role === 'admin') {
      const adminLink = document.getElementById('admin-link');
      adminLink?.classList.remove('hidden');
      adminLink?.classList.add('flex');
    }
  }

  function bindShell() {
    const date = document.getElementById('current-date');
    if (date) date.textContent = new Intl.DateTimeFormat('en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());

    document.getElementById('logout-button')?.addEventListener('click', async () => {
      try { await api('/logout', { method: 'POST' }); } catch (_) {}
      clearAuth();
      window.location.href = '/login';
    });

    const sidebar = document.getElementById('sidebar');
    const open = () => { sidebar?.classList.add('is-open'); document.body.classList.add('sidebar-open'); };
    const close = () => { sidebar?.classList.remove('is-open'); document.body.classList.remove('sidebar-open'); };
    document.getElementById('open-sidebar')?.addEventListener('click', open);
    document.getElementById('close-sidebar')?.addEventListener('click', close);
    document.body.addEventListener('click', event => {
      if (document.body.classList.contains('sidebar-open') && !sidebar.contains(event.target) && event.target.id !== 'open-sidebar') close();
    });
  }

  async function loadNotificationDot() {
    try {
      const result = await api('/notifications?status=unread');
      if ((result.total || 0) > 0) document.getElementById('notification-dot')?.classList.remove('hidden');
    } catch (_) {}
  }

  function statCard(label, value, detail = '') {
    return `<div class="border border-border rounded-sm p-5 bg-white"><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">${escapeHtml(label)}</p><p class="font-display text-4xl font-bold text-primary">${escapeHtml(value)}</p>${detail ? `<p class="text-xs text-muted-foreground mt-2">${escapeHtml(detail)}</p>` : ''}</div>`;
  }

  async function renderDashboard() {
    loading('Building your daily overview…');
    const data = await api('/dashboard');
    const s = data.summary;
    const taskRows = data.today_tasks?.length ? data.today_tasks.map(task => `
      <li class="border border-border rounded-sm p-4 flex items-center gap-4">
        <button data-complete-task="${task.id}" class="w-5 h-5 border border-primary rounded-sm flex items-center justify-center text-xs ${task.status === 'completed' ? 'bg-primary text-white' : ''}">${task.status === 'completed' ? '✓' : ''}</button>
        <div class="flex-1 min-w-0"><p class="text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'font-medium'}">${escapeHtml(task.title)}</p><p class="text-xs text-muted-foreground mt-1">${escapeHtml(task.category || 'General')} · ${formatDate(task.due_date, true)}</p></div>
        <span class="text-[10px] font-mono px-2 py-1 rounded-sm bg-muted text-muted-foreground">${escapeHtml(task.priority || 'medium').toUpperCase()}</span>
      </li>`).join('') : empty('No tasks are scheduled for today.');
    const habitRows = data.live_habits?.length ? data.live_habits.map(habit => `
      <div class="border border-border rounded-sm p-4 flex items-center gap-4">
        <div class="text-2xl">${escapeHtml(habit.emoji || '◎')}</div>
        <div class="flex-1"><p class="text-sm font-medium">${escapeHtml(habit.name)}</p><p class="text-xs text-muted-foreground mt-1">${escapeHtml(habit.frequency)} · ${habit.current_streak} day streak</p></div>
        <button data-tick-habit="${habit.id}" class="text-xs font-medium text-primary border border-primary/20 rounded-sm px-3 py-2 hover:bg-secondary">Mark today</button>
      </div>`).join('') : empty('Create a habit to begin building a streak.');
    const history = data.week_history || [];

    content.innerHTML = `
      <section class="flex items-end justify-between gap-6 flex-wrap">
        <div><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Your daily overview</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Good day, <em class="italic font-normal text-accent">${escapeHtml(state.user.name.split(' ')[0])}.</em></h1><p class="text-sm text-muted-foreground mt-3">One system for tasks, habits, mood, and reflection.</p></div>
        <a href="/app/tasks" class="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-3 rounded-sm hover:bg-primary-dark">＋ Add a task</a>
      </section>
      <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        ${statCard('Weekly score', `${s.weekly_score}%`, 'Completed work this week')}
        ${statCard('Tasks completed', `${s.tasks_done}/${s.tasks_total}`, 'Weekly progress')}
        ${statCard('Longest streak', `${s.longest_streak} days`, 'Your strongest habit')}
        ${statCard('Mood average', s.mood_average ? Number(s.mood_average).toFixed(1) : '—', 'Last seven check-ins')}
      </section>
      <section class="grid xl:grid-cols-[1.25fr_.75fr] gap-6">
        <div class="border border-border rounded-sm">
          <div class="px-6 py-5 border-b border-border flex items-center justify-between"><div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Focus</p><h3 class="font-display text-xl font-semibold text-primary">Today’s tasks</h3></div><a href="/app/tasks" class="text-xs text-muted-foreground hover:text-primary">See all →</a></div>
          <ul class="p-5 flex flex-col gap-2">${taskRows}</ul>
        </div>
        <div class="border border-border rounded-sm">
          <div class="px-6 py-5 border-b border-border flex items-center justify-between"><div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Consistency</p><h3 class="font-display text-xl font-semibold text-primary">Live habits</h3></div><a href="/app/habits" class="text-xs text-muted-foreground hover:text-primary">See all →</a></div>
          <div class="p-5 flex flex-col gap-2">${habitRows}</div>
        </div>
      </section>
      <section class="bg-primary text-white rounded-sm p-6">
        <p class="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-4">Four-week history</p>
        <div class="grid grid-cols-4 gap-4">${history.map(item => `<div><div class="h-24 border border-white/10 rounded-sm flex items-end"><div class="w-full bg-accent" style="height:${Math.max(4, Number(item.score || 0))}%"></div></div><p class="text-xs font-mono text-white/60 mt-2">${escapeHtml(item.week)} · ${item.score}%</p></div>`).join('')}</div>
      </section>`;

    content.querySelectorAll('[data-complete-task]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/tasks/${button.dataset.completeTask}/complete`, { method: 'POST' }); toast('Task completed.'); renderDashboard(); } catch (err) { toast(err.message, 'error'); }
    }));
    content.querySelectorAll('[data-tick-habit]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/habits/${button.dataset.tickHabit}/tick`, { method: 'POST', body: '{}' }); toast('Habit recorded for today.'); renderDashboard(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  function taskModal(task = null) {
    openModal(task ? 'Edit task' : 'Create a new task', `
      <form id="task-modal-form" class="grid gap-5">
        ${field('Task title', 'title', task?.title || '', { required: true, max: 255 })}
        ${field('Description', 'description', task?.description || '', { textarea: true })}
        <div class="grid sm:grid-cols-2 gap-4">
          ${field('Due date', 'due_date', task?.due_date ? String(task.due_date).slice(0, 16) : '', { type: 'datetime-local' })}
          ${selectField('Priority', 'priority', task?.priority || 'medium', ['low', 'medium', 'high'])}
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          ${field('Category', 'category', task?.category || 'Personal', { max: 40 })}
          ${task ? selectField('Status', 'status', task.status, ['pending', 'in_progress', 'completed']) : ''}
        </div>
        <div class="flex justify-end gap-3 pt-2"><button type="button" data-close-modal class="border border-border rounded-sm px-4 py-2 text-sm">Cancel</button><button class="bg-primary text-white rounded-sm px-5 py-2.5 text-sm font-medium" type="submit">${task ? 'Save changes' : 'Create task'}</button></div>
      </form>`, root => {
        root.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
        root.querySelector('#task-modal-form').addEventListener('submit', async event => {
          event.preventDefault();
          const payload = formObject(event.currentTarget);
          try {
            await api(task ? `/tasks/${task.id}` : '/tasks', { method: task ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
            closeModal(); toast(task ? 'Task updated.' : 'Task created.'); renderTasks();
          } catch (err) { toast(err.message, 'error'); }
        });
      });
  }

  async function renderTasks(filter = 'all') {
    loading('Loading tasks…');
    const tasks = await api(`/tasks?filter=${encodeURIComponent(filter)}`);
    state.tasks = tasks;
    const rows = tasks.length ? tasks.map(task => `
      <li class="border border-border rounded-sm p-4 flex items-center gap-4 hover:border-primary/40 transition-colors">
        <button data-complete="${task.id}" class="w-5 h-5 shrink-0 border border-primary rounded-sm flex items-center justify-center text-xs ${task.status === 'completed' ? 'bg-primary text-white' : ''}" ${task.status === 'completed' ? 'disabled' : ''}>${task.status === 'completed' ? '✓' : ''}</button>
        <div class="flex-1 min-w-0"><p class="text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'font-medium'}">${escapeHtml(task.title)}</p><p class="text-xs text-muted-foreground/80 mt-1">${escapeHtml(task.description || 'No description')} · ${formatDate(task.due_date, true)}</p></div>
        <span class="hidden md:inline text-[10px] font-mono px-2 py-1 rounded-sm bg-muted text-muted-foreground">${escapeHtml(task.category || 'GENERAL').toUpperCase()}</span>
        <span class="hidden sm:inline text-[10px] font-mono px-2 py-1 rounded-sm ${task.priority === 'high' ? 'bg-accent/10 text-accent' : 'bg-secondary text-primary'}">${escapeHtml(task.priority).toUpperCase()}</span>
        <div class="flex items-center gap-1"><button data-edit="${task.id}" class="w-8 h-8 rounded-sm hover:bg-muted" title="Edit">✎</button><button data-delete="${task.id}" class="w-8 h-8 rounded-sm hover:bg-red-50 text-red-700" title="Delete">×</button></div>
      </li>`).join('') : empty('No tasks match this filter.');

    content.innerHTML = `
      <section class="flex items-end justify-between gap-6 flex-wrap"><div><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Task management</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Today’s plan, <em class="italic font-normal text-accent">simply done.</em></h1></div><button id="new-task" class="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-primary-dark">＋ New task</button></section>
      <div class="flex items-center gap-2 border-b border-border overflow-x-auto" id="task-tabs">
        ${[['today','Today'],['upcoming','Upcoming'],['completed','Completed'],['overdue','Overdue'],['all','All tasks']].map(([key,label]) => `<button data-filter="${key}" class="px-4 py-3 -mb-px border-b-2 ${filter === key ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground'} text-sm whitespace-nowrap">${label}</button>`).join('')}
      </div>
      <form id="quick-task" class="bg-muted border border-border rounded-sm p-4 flex items-center gap-3"><span class="text-xl text-muted-foreground">＋</span><input name="title" required type="text" placeholder="Add a new task — press Enter" class="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" /><span class="hidden sm:inline text-[10px] font-mono text-muted-foreground">↵ ENTER TO ADD</span></form>
      <section><div class="flex items-center gap-3 mb-4"><div class="w-6 h-6 rounded-sm bg-secondary flex items-center justify-center text-primary">✓</div><h3 class="font-display text-xl font-semibold text-primary">Your tasks</h3><span class="text-xs font-mono text-muted-foreground">${tasks.length} ITEMS</span><div class="flex-1 h-px bg-border"></div></div><ul class="flex flex-col gap-2">${rows}</ul></section>`;

    document.getElementById('new-task').addEventListener('click', () => taskModal());
    document.getElementById('primary-action').onclick = () => taskModal();
    content.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => renderTasks(button.dataset.filter)));
    document.getElementById('quick-task').addEventListener('submit', async event => {
      event.preventDefault();
      try { await api('/tasks', { method: 'POST', body: JSON.stringify({ title: event.currentTarget.title.value, priority: 'medium', category: 'Personal' }) }); toast('Task added.'); renderTasks(filter); } catch (err) { toast(err.message, 'error'); }
    });
    content.querySelectorAll('[data-complete]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/tasks/${button.dataset.complete}/complete`, { method: 'POST' }); toast('Task completed.'); renderTasks(filter); } catch (err) { toast(err.message, 'error'); }
    }));
    content.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => taskModal(state.tasks.find(item => String(item.id) === button.dataset.edit))));
    content.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
      if (!confirm('Delete this task?')) return;
      try { await api(`/tasks/${button.dataset.delete}`, { method: 'DELETE' }); toast('Task deleted.'); renderTasks(filter); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  function habitModal(habit = null) {
    openModal(habit ? 'Edit habit' : 'Create a new habit', `
      <form id="habit-form" class="grid gap-5">
        ${field('Habit name', 'name', habit?.name || '', { required: true, max: 120 })}
        <div class="grid sm:grid-cols-2 gap-4">${field('Emoji', 'emoji', habit?.emoji || '◎', { max: 8 })}${selectField('Frequency', 'frequency', habit?.frequency || 'daily', ['daily','weekdays','weekends','weekly'])}</div>
        <div class="flex justify-end gap-3"><button type="button" data-close-modal class="border border-border rounded-sm px-4 py-2 text-sm">Cancel</button><button type="submit" class="bg-primary text-white rounded-sm px-5 py-2.5 text-sm font-medium">${habit ? 'Save changes' : 'Create habit'}</button></div>
      </form>`, root => {
        root.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
        root.querySelector('#habit-form').addEventListener('submit', async event => {
          event.preventDefault();
          try { await api(habit ? `/habits/${habit.id}` : '/habits', { method: habit ? 'PATCH' : 'POST', body: JSON.stringify(formObject(event.currentTarget)) }); closeModal(); toast(habit ? 'Habit updated.' : 'Habit created.'); renderHabits(); } catch (err) { toast(err.message, 'error'); }
        });
      });
  }

  async function renderHabits() {
    loading('Loading habits and streaks…');
    const habits = await api('/habits');
    state.habits = habits;
    const totalTicks = habits.reduce((sum, habit) => sum + (habit.ticks?.length || 0), 0);
    const best = habits.reduce((max, habit) => Math.max(max, Number(habit.best_streak || 0)), 0);
    const cards = habits.length ? habits.map(habit => `
      <article class="border border-border rounded-sm p-5 hover:border-primary/40 transition-colors">
        <div class="flex items-start justify-between gap-3 mb-6"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center text-3xl">${escapeHtml(habit.emoji || '◎')}</div><div><h3 class="font-display text-xl font-semibold text-primary">${escapeHtml(habit.name)}</h3><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">${escapeHtml(habit.frequency)}</p></div></div><div class="flex"><button data-edit-habit="${habit.id}" class="w-8 h-8 hover:bg-muted rounded-sm">✎</button><button data-delete-habit="${habit.id}" class="w-8 h-8 hover:bg-red-50 text-red-700 rounded-sm">×</button></div></div>
        <div class="grid grid-cols-2 gap-3 mb-5"><div class="bg-muted rounded-sm p-3"><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Current streak</p><p class="font-display text-3xl font-bold text-primary mt-1">${habit.current_streak}<span class="text-sm font-sans font-normal"> days</span></p></div><div class="bg-muted rounded-sm p-3"><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Personal best</p><p class="font-display text-3xl font-bold text-accent mt-1">${habit.best_streak}<span class="text-sm font-sans font-normal"> days</span></p></div></div>
        <button data-tick="${habit.id}" class="w-full bg-primary text-white text-sm font-medium px-4 py-3 rounded-sm hover:bg-primary-dark">Mark complete today</button>
      </article>`).join('') : empty('No habits yet. Create your first daily practice.');

    content.innerHTML = `
      <section class="flex items-end justify-between gap-6 flex-wrap"><div><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Habit tracking</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Small steps, <em class="italic font-normal text-accent">lasting change.</em></h1></div><button id="new-habit" class="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-primary-dark">＋ New habit</button></section>
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">${statCard('Active habits', String(habits.length))}${statCard('Best streak', `${best} days`)}${statCard('Recent check-ins', String(totalTicks))}${statCard('Consistency', habits.length ? 'In progress' : 'Start today')}</section>
      <section class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">${cards}</section>`;

    document.getElementById('new-habit').addEventListener('click', () => habitModal());
    document.getElementById('primary-action').onclick = () => habitModal();
    content.querySelectorAll('[data-tick]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/habits/${button.dataset.tick}/tick`, { method: 'POST', body: '{}' }); toast('Habit recorded for today.'); renderHabits(); } catch (err) { toast(err.message, 'error'); }
    }));
    content.querySelectorAll('[data-edit-habit]').forEach(button => button.addEventListener('click', () => habitModal(state.habits.find(item => String(item.id) === button.dataset.editHabit))));
    content.querySelectorAll('[data-delete-habit]').forEach(button => button.addEventListener('click', async () => {
      if (!confirm('Delete this habit and its history?')) return;
      try { await api(`/habits/${button.dataset.deleteHabit}`, { method: 'DELETE' }); toast('Habit deleted.'); renderHabits(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  function journalModal(entry = null) {
    openModal(entry ? 'Edit journal entry' : 'Write a journal entry', `
      <form id="journal-form" class="grid gap-5">
        ${field('Title', 'title', entry?.title || '', { required: true, max: 255 })}
        ${field('Reflection', 'content', entry?.content || '', { required: true, textarea: true })}
        ${field('Tags (comma separated)', 'tags_text', Array.isArray(entry?.tags) ? entry.tags.join(', ') : '', { placeholder: 'personal, gratitude' })}
        <div class="flex justify-end gap-3"><button type="button" data-close-modal class="border border-border rounded-sm px-4 py-2 text-sm">Cancel</button><button type="submit" class="bg-primary text-white rounded-sm px-5 py-2.5 text-sm font-medium">${entry ? 'Save entry' : 'Publish entry'}</button></div>
      </form>`, root => {
        root.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
        root.querySelector('#journal-form').addEventListener('submit', async event => {
          event.preventDefault();
          const raw = formObject(event.currentTarget);
          const payload = { title: raw.title, content: raw.content, tags: raw.tags_text ? raw.tags_text.split(',').map(tag => tag.trim()).filter(Boolean) : [] };
          try { await api(entry ? `/journal/${entry.id}` : '/journal', { method: entry ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); closeModal(); toast(entry ? 'Entry updated.' : 'Entry saved.'); renderJournal(); } catch (err) { toast(err.message, 'error'); }
        });
      });
  }

  async function renderJournal() {
    loading('Opening your journal…');
    const result = await api('/journal');
    const entries = result.data || [];
    state.journal = entries;
    const cards = entries.length ? entries.map(entry => `
      <article class="border border-border rounded-sm p-5 hover:border-primary/40 transition-colors">
        <div class="flex items-start justify-between gap-3"><div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">${formatDate(entry.created_at)}</p><h3 class="font-display text-2xl font-semibold text-primary">${escapeHtml(entry.title)}</h3></div><div class="flex"><button data-edit-entry="${entry.id}" class="w-8 h-8 hover:bg-muted rounded-sm">✎</button><button data-delete-entry="${entry.id}" class="w-8 h-8 hover:bg-red-50 text-red-700 rounded-sm">×</button></div></div>
        <p class="text-sm text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">${escapeHtml(entry.content)}</p>
        ${entry.tags?.length ? `<div class="flex flex-wrap gap-2 mt-4">${entry.tags.map(tag => `<span class="text-[10px] font-mono uppercase tracking-widest bg-muted text-muted-foreground rounded-sm px-2 py-1">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </article>`).join('') : empty('Your journal is empty. Write the first entry.');

    content.innerHTML = `
      <section class="flex items-end justify-between gap-6 flex-wrap"><div><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Private reflection</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Make sense of <em class="italic font-normal text-accent">your days.</em></h1></div><button id="new-entry" class="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-primary-dark">＋ New entry</button></section>
      <section class="bg-muted border border-border rounded-sm p-5"><div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Daily check-in</p><h3 class="font-display text-xl font-semibold text-primary">How are you feeling?</h3></div><div class="flex flex-wrap gap-2" id="journal-moods">${['😞','😕','😐','🙂','😊','🤩'].map((emoji,index) => `<button data-score="${index+1}" data-emoji="${emoji}" class="w-12 h-12 rounded-sm border border-border bg-white hover:border-accent flex items-center justify-center text-2xl">${emoji}</button>`).join('')}</div></div></section>
      <section class="grid lg:grid-cols-2 gap-4">${cards}</section>`;

    document.getElementById('new-entry').addEventListener('click', () => journalModal());
    document.getElementById('primary-action').onclick = () => journalModal();
    content.querySelectorAll('[data-score]').forEach(button => button.addEventListener('click', async () => {
      try { await api('/mood', { method: 'POST', body: JSON.stringify({ score: Number(button.dataset.score), emoji: button.dataset.emoji }) }); toast('Mood saved.'); } catch (err) { toast(err.message, 'error'); }
    }));
    content.querySelectorAll('[data-edit-entry]').forEach(button => button.addEventListener('click', () => journalModal(state.journal.find(item => String(item.id) === button.dataset.editEntry))));
    content.querySelectorAll('[data-delete-entry]').forEach(button => button.addEventListener('click', async () => {
      if (!confirm('Delete this journal entry?')) return;
      try { await api(`/journal/${button.dataset.deleteEntry}`, { method: 'DELETE' }); toast('Entry deleted.'); renderJournal(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  async function renderMood() {
    loading('Loading mood history…');
    const moods = await api('/mood');
    const average = moods.length ? moods.reduce((sum, item) => sum + Number(item.score), 0) / moods.length : 0;
    content.innerHTML = `
      <section><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Emotional wellbeing</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Notice how you <em class="italic font-normal text-accent">really feel.</em></h1><p class="text-sm text-muted-foreground mt-3">A simple check-in creates a useful picture over time.</p></section>
      <section class="grid lg:grid-cols-[1.15fr_.85fr] gap-6">
        <div class="border border-border rounded-sm p-6"><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Today’s check-in</p><h3 class="font-display text-2xl font-semibold text-primary mb-5">Choose your mood</h3><div class="grid grid-cols-3 sm:grid-cols-6 gap-3" id="mood-buttons">${['😞','😕','😐','🙂','😊','🤩'].map((emoji,index) => `<button data-score="${index+1}" data-emoji="${emoji}" class="aspect-square rounded-sm border border-border hover:border-accent hover:bg-accent/5 flex items-center justify-center text-4xl">${emoji}</button>`).join('')}</div><textarea id="mood-note" class="w-full min-h-28 border border-border rounded-sm px-4 py-3 text-sm outline-none focus:border-primary mt-5" placeholder="Optional note about today…"></textarea></div>
        <div class="bg-primary text-white rounded-sm p-6"><p class="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-3">30-day insight</p><p class="font-display text-5xl font-bold">${average ? average.toFixed(1) : '—'}</p><p class="text-sm text-white/60 mt-2">Average mood score</p><div class="mt-8 space-y-3">${moods.slice(0,6).map(item => `<div class="flex items-center justify-between border-b border-white/10 pb-3"><span class="text-2xl">${escapeHtml(item.emoji || '🙂')}</span><span class="text-xs text-white/60">${formatDate(item.recorded_on)}</span><span class="font-mono">${item.score}/6</span></div>`).join('') || '<p class="text-sm text-white/60">No mood history yet.</p>'}</div></div>
      </section>`;
    content.querySelectorAll('[data-score]').forEach(button => button.addEventListener('click', async () => {
      try { await api('/mood', { method: 'POST', body: JSON.stringify({ score: Number(button.dataset.score), emoji: button.dataset.emoji, note: document.getElementById('mood-note').value || null }) }); toast('Mood check-in saved.'); renderMood(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  async function renderNotifications() {
    loading('Loading notifications…');
    const result = await api('/notifications');
    const notifications = result.data || [];
    content.innerHTML = `
      <section><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Stay informed</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Your <em class="italic font-normal text-accent">notifications.</em></h1></section>
      <section class="border border-border rounded-sm"><div class="px-6 py-5 border-b border-border flex items-center justify-between"><h3 class="font-display text-xl font-semibold text-primary">Recent activity</h3><span class="text-xs font-mono text-muted-foreground">${result.total || 0} TOTAL</span></div><div class="p-5 flex flex-col gap-2">${notifications.length ? notifications.map(item => `<article class="border rounded-sm p-4 flex items-start gap-4 ${item.status === 'unread' ? 'border-accent/30 bg-accent/[0.03]' : 'border-border'}"><div class="w-9 h-9 bg-secondary rounded-sm flex items-center justify-center">◉</div><div class="flex-1"><p class="text-sm font-medium">${escapeHtml(item.message)}</p><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">${escapeHtml(item.type)} · ${formatDate(item.created_at, true)}</p></div><div class="flex gap-1">${item.status === 'unread' ? `<button data-read="${item.id}" class="text-xs border border-border rounded-sm px-3 py-2">Mark read</button>` : ''}<button data-delete-note="${item.id}" class="w-8 h-8 hover:bg-red-50 text-red-700 rounded-sm">×</button></div></article>`).join('') : empty('There are no notifications yet.')}</div></section>`;
    content.querySelectorAll('[data-read]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/notifications/${button.dataset.read}/read`, { method: 'POST' }); toast('Notification marked as read.'); renderNotifications(); } catch (err) { toast(err.message, 'error'); }
    }));
    content.querySelectorAll('[data-delete-note]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/notifications/${button.dataset.deleteNote}`, { method: 'DELETE' }); toast('Notification deleted.'); renderNotifications(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  async function renderProfile() {
    content.innerHTML = `
      <section><p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Account settings</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">Your personal <em class="italic font-normal text-accent">profile.</em></h1></section>
      <section class="grid lg:grid-cols-[.65fr_1.35fr] gap-6">
        <div class="bg-primary text-white rounded-sm p-7"><div class="w-20 h-20 rounded-full bg-accent flex items-center justify-center font-display text-3xl font-bold mb-5">${initials(state.user.name)}</div><h2 class="font-display text-3xl font-semibold">${escapeHtml(state.user.name)}</h2><p class="text-white/60 text-sm mt-2">${escapeHtml(state.user.email)}</p><p class="text-[10px] font-mono uppercase tracking-widest text-accent mt-6">${escapeHtml(state.user.role)} · ${escapeHtml(state.user.status)}</p></div>
        <div class="border border-border rounded-sm p-6"><form id="profile-form" class="grid gap-5">${field('Full name','name',state.user.name,{required:true,max:120})}${field('Email','email',state.user.email,{type:'email',required:true})}<div class="grid sm:grid-cols-2 gap-4">${field('Phone','phone',state.user.phone || '',{max:30})}${field('Avatar URL','avatar_url',state.user.avatar_url || '',{type:'url'})}</div><div class="border-t border-border pt-5 grid sm:grid-cols-2 gap-4">${field('New password','password','',{type:'password'})}${field('Confirm password','password_confirmation','',{type:'password'})}</div><div><button type="submit" class="bg-primary text-white rounded-sm px-5 py-3 text-sm font-medium">Save profile</button></div></form></div>
      </section>`;
    document.getElementById('profile-form').addEventListener('submit', async event => {
      event.preventDefault();
      const payload = formObject(event.currentTarget);
      if (!payload.password) { delete payload.password; delete payload.password_confirmation; }
      try { const result = await api('/profile', { method: 'PATCH', body: JSON.stringify(payload) }); state.user = result.user; localStorage.setItem('lifestyle_user', JSON.stringify(state.user)); toast('Profile updated.'); await ensureUser(); renderProfile(); } catch (err) { toast(err.message, 'error'); }
    });
  }

  async function renderAdmin() {
    if (state.user.role !== 'admin') { window.location.href = '/app/dashboard'; return; }
    loading('Loading the administration console…');
    const [dashboard, usersResult] = await Promise.all([api('/admin/dashboard'), api('/admin/users')]);
    const users = usersResult.data || [];
    const s = dashboard.stats;
    content.innerHTML = `
      <section><p class="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Admin console</p><h1 class="font-display text-4xl lg:text-5xl font-bold text-primary">The <em class="italic font-normal text-accent">whole community</em>, at a glance.</h1></section>
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">${statCard('Total users', String(s.total_users))}${statCard('Active today', String(s.active_today))}<div class="border border-border rounded-sm p-5 bg-primary text-white"><p class="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-4">Tasks completed</p><p class="font-display text-4xl font-bold">${s.tasks_completed}</p></div>${statCard('Open issues', String(s.open_issues))}</section>
      <section class="border border-border rounded-sm overflow-hidden"><div class="px-6 py-5 flex items-center justify-between border-b border-border"><div><p class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Community access</p><h3 class="font-display text-xl font-semibold text-primary">Users</h3></div><span class="text-xs font-mono text-muted-foreground">PAGE ${usersResult.current_page || 1}</span></div><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="border-b border-border"><tr class="text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground"><th class="px-6 py-3">User</th><th class="px-4 py-3">Role</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Joined</th><th class="px-6 py-3 text-right">Action</th></tr></thead><tbody>${users.map(user => `<tr class="border-b border-border hover:bg-muted/40"><td class="px-6 py-4"><p class="font-medium">${escapeHtml(user.name)}</p><p class="text-xs text-muted-foreground font-mono">${escapeHtml(user.email)}</p></td><td class="px-4"><span class="text-[10px] font-mono px-2 py-1 rounded-sm bg-muted">${escapeHtml(user.role).toUpperCase()}</span></td><td class="px-4"><span class="text-xs">${escapeHtml(user.status)}</span></td><td class="px-4 text-xs font-mono text-muted-foreground">${formatDate(user.created_at)}</td><td class="px-6 text-right">${user.role === 'admin' ? '<span class="text-xs text-muted-foreground">Protected</span>' : `<button data-user-status="${user.id}" data-current="${user.status}" class="text-xs text-primary hover:underline">${user.status === 'suspended' ? 'Activate' : 'Suspend'} →</button>`}</td></tr>`).join('')}</tbody></table></div></section>`;
    content.querySelectorAll('[data-user-status]').forEach(button => button.addEventListener('click', async () => {
      const status = button.dataset.current === 'suspended' ? 'active' : 'suspended';
      if (!confirm(`Change this user to ${status}?`)) return;
      try { await api(`/admin/users/${button.dataset.userStatus}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); toast('User status updated.'); renderAdmin(); } catch (err) { toast(err.message, 'error'); }
    }));
  }

  async function renderProtectedPage() {
    bindShell();
    await ensureUser();
    await loadNotificationDot();
    const primary = document.getElementById('primary-action');
    if (['tasks', 'habits', 'journal'].includes(page)) primary?.classList.remove('hidden');

    const renderers = {
      dashboard: renderDashboard,
      tasks: renderTasks,
      habits: renderHabits,
      journal: renderJournal,
      mood: renderMood,
      notifications: renderNotifications,
      profile: renderProfile,
      admin: renderAdmin,
    };
    await (renderers[page] || renderDashboard)();
  }

  async function init() {
    if (['login', 'register'].includes(page)) { bindAuth(); return; }
    if (page === 'home') return;
    try { await renderProtectedPage(); } catch (err) {
      if (state.token && content) content.innerHTML = `<div class="border border-red-200 bg-red-50 text-red-800 rounded-sm p-6"><h2 class="font-display text-2xl font-semibold mb-2">The page could not be loaded.</h2><p class="text-sm">${escapeHtml(err.message)}</p><button onclick="location.reload()" class="mt-4 bg-primary text-white rounded-sm px-4 py-2 text-sm">Try again</button></div>`;
    }
  }

  init();
})();

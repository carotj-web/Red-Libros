'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Flame,
  MapPin,
  Plus,
  Trophy,
  UploadCloud,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ranking = [
  { name: 'Medellín Norte', city: 'Colombia', books: 12480, tone: 'bg-[#ff6b57]' },
  { name: 'Lima Esperanza', city: 'Perú', books: 11320, tone: 'bg-[#f5bd41]' },
  { name: 'Quito Centro', city: 'Ecuador', books: 9860, tone: 'bg-[#3dc6a2]' },
  { name: 'Bogotá Centro', city: 'Colombia', books: 7840, tone: 'bg-[#7567f8]' },
  { name: 'Córdoba Sur', city: 'Argentina', books: 7210, tone: 'bg-[#4d9be6]' },
];

const yearlyPoints = '18,214 82,198 146,184 210,166 274,174 338,140 402,130 466,114 530,92 594,83 658,58 722,42';
const marathonPoints = '18,224 82,220 146,216 210,210 274,206 338,198 402,190 466,174 530,152 594,126 658,78 722,26';
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatNumber = (value: number) => new Intl.NumberFormat('es-CO').format(value);

type WebMcpContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: unknown) => unknown;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

export default function Home() {
  const [period, setPeriod] = useState('year');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [books, setBooks] = useState('');
  const [groupTotal, setGroupTotal] = useState(7840);
  const [latinTotal, setLatinTotal] = useState(287450);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const chartPoints = period === 'year' ? yearlyPoints : marathonPoints;
  const chartTotal = period === 'year' ? '287.450' : '93.680';
  const chartChange = period === 'year' ? '+18,4%' : '+36,2%';

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(modelContext.registerTool({
      name: 'record_distribution',
      title: 'Registrar distribución de libros',
      description: 'Registra una cantidad de libros para el grupo Bogotá Centro y actualiza los totales visibles del prototipo.',
      inputSchema: {
        type: 'object',
        properties: { books: { type: 'integer', minimum: 1, maximum: 100000 } },
        required: ['books'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const amount = Number((input as { books?: unknown })?.books);
        if (!Number.isInteger(amount) || amount < 1 || amount > 100000) {
          throw new Error('books debe ser un número entero entre 1 y 100.000');
        }
        setGroupTotal((current) => current + amount);
        setLatinTotal((current) => current + amount);
        return { status: 'registrado', books: amount, group: 'Bogotá Centro' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  const topGroups = useMemo(
    () => ranking.map((group) => (group.name === 'Bogotá Centro' ? { ...group, books: groupTotal } : group)),
    [groupTotal],
  );

  function handlePhoto(file?: File) {
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(books);
    if (!amount || amount < 1) return;
    setGroupTotal((current) => current + amount);
    setLatinTotal((current) => current + amount);
    setSaved(true);
    window.setTimeout(() => {
      setDialogOpen(false);
      setSaved(false);
      setBooks('');
      setPhotoPreview(null);
    }, 950);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#20245b]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ffca55] text-[#20245b] shadow-[0_8px_24px_rgba(255,202,85,.25)]">
              <BookOpen className="size-5" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-[15px] font-bold tracking-tight">Red de Libros</p>
              <p className="truncate text-xs text-indigo-200">Latinoamérica</p>
            </div>
          </div>

          <nav className="ml-8 hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            <Button className="h-9 bg-white/12 px-4 text-white hover:bg-white/18">Panorama</Button>
            <Button variant="ghost" className="h-9 px-4 text-indigo-100 hover:bg-white/10 hover:text-white">Grupos</Button>
            <Button variant="ghost" className="h-9 px-4 text-indigo-100 hover:bg-white/10 hover:text-white">Actividad</Button>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden text-indigo-100 hover:bg-white/10 hover:text-white sm:inline-flex" aria-label="Notificaciones">
              <Bell />
            </Button>
            <div className="hidden h-8 w-px bg-white/15 sm:block" />
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="grid size-9 place-items-center rounded-full bg-[#7567f8] text-xs font-bold">BC</span>
              <div>
                <p className="text-sm font-semibold leading-tight">Bogotá Centro</p>
                <p className="text-xs text-indigo-200">Coordinación</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button className="ml-1 h-10 rounded-xl bg-[#ff6b57] px-3.5 font-bold text-white shadow-[0_10px_24px_rgba(255,107,87,.22)] hover:bg-[#ef5e4b] sm:px-4" />}>
                <Plus data-icon="inline-start" />
                <span className="hidden sm:inline">Registrar distribución</span>
                <span className="sm:hidden">Registrar</span>
              </DialogTrigger>
              <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-0 p-0 sm:max-w-[520px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader className="border-b px-6 pb-5 pt-6">
                    <div className="mb-1 grid size-11 place-items-center rounded-xl bg-[#eceaff] text-[#5144d8]">
                      <BookOpen className="size-5" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Registrar distribución</DialogTitle>
                    <DialogDescription>Documenta la jornada de tu grupo. Este registro actualizará el avance general.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5 px-6 py-5">
                    <div className="grid gap-2">
                      <Label htmlFor="books">Libros distribuidos</Label>
                      <Input id="books" type="number" min="1" required value={books} onChange={(event) => setBooks(event.target.value)} placeholder="Ej. 250" className="h-11 text-base" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input id="date" type="date" defaultValue="2026-12-12" className="h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Campaña</Label>
                        <Select defaultValue="maraton">
                          <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maraton">Maratón de diciembre</SelectItem>
                            <SelectItem value="anual">Distribución anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="place">Lugar</Label>
                      <Input id="place" defaultValue="Bogotá, Colombia" className="h-11" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="photo">Evidencia fotográfica</Label>
                      <label htmlFor="photo" className="group relative flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#a9a4dd] bg-[#f7f6ff] px-4 py-5 text-center transition hover:border-[#6558df] hover:bg-[#f1efff]">
                        {photoPreview ? (
                          <Image src={photoPreview} alt="Vista previa de la evidencia" fill className="object-cover" unoptimized />
                        ) : (
                          <>
                            <UploadCloud className="mb-2 size-7 text-[#6558df]" />
                            <span className="text-sm font-semibold text-[#37317a]">Seleccionar una foto</span>
                            <span className="mt-1 text-xs text-muted-foreground">JPG o PNG · máximo 10 MB</span>
                          </>
                        )}
                      </label>
                      <Input id="photo" type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} />
                    </div>
                  </div>

                  <DialogFooter className="mx-0 mb-0 rounded-b-2xl px-6 py-4">
                    <DialogClose render={<Button type="button" variant="outline" className="h-10 px-4" />}>Cancelar</DialogClose>
                    <Button type="submit" className="h-10 min-w-40 bg-[#5144d8] px-5 font-bold text-white hover:bg-[#4438bd]">
                      {saved ? <><CheckCircle2 /> Registro guardado</> : 'Guardar registro'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6558df]">
              <span className="size-2 rounded-full bg-[#3dc6a2] shadow-[0_0_0_4px_rgba(61,198,162,.14)]" />
              Datos demostrativos · 2026
            </div>
            <h1 className="font-heading text-3xl font-black tracking-[-0.035em] text-[#20245b] sm:text-4xl">Así avanza nuestra misión</h1>
          </div>
          <Select defaultValue="latam">
            <SelectTrigger className="h-10 w-full rounded-xl bg-white px-3 shadow-sm sm:w-[220px]"><MapPin className="text-[#6558df]" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="latam">Toda Latinoamérica</SelectItem>
              <SelectItem value="colombia">Colombia</SelectItem>
              <SelectItem value="region-andina">Región Andina</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section className="record-panel relative mb-5 overflow-hidden rounded-[28px] bg-[#20245b] p-6 text-white shadow-[0_18px_60px_rgba(32,36,91,.2)] sm:p-8 lg:grid lg:grid-cols-[1.35fr_.65fr] lg:items-end lg:gap-12">
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#ffca55]">
              <Trophy className="size-4" /> Récord latinoamericano
            </div>
            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="font-heading text-[clamp(3.3rem,8vw,6.5rem)] font-black leading-[.8] tracking-[-0.07em] tabular-nums">{formatNumber(latinTotal)}</p>
              <p className="pb-1 text-base font-semibold text-indigo-200 sm:pb-2 sm:text-lg">libros distribuidos</p>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-indigo-100">El esfuerzo conjunto de 116 grupos activos, sumado en una sola cifra para inspirar a toda la comunidad.</p>
          </div>
          <div className="relative z-10 mt-8 rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm lg:mt-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Meta anual</p>
                <p className="mt-1 text-xs text-indigo-200">Faltan {formatNumber(320000 - latinTotal)} libros</p>
              </div>
              <span className="rounded-full bg-[#ffca55] px-3 py-1 text-sm font-black text-[#20245b]">{Math.round((latinTotal / 320000) * 100)}%</span>
            </div>
            <Progress value={(latinTotal / 320000) * 100} className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-white/15 [&_[data-slot=progress-indicator]]:bg-[#ffca55]" aria-label="Avance de la meta anual" />
          </div>
        </section>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<BookOpen />} label="Tu grupo este año" value={formatNumber(groupTotal)} helper="+12% frente al año anterior" color="violet" />
          <MetricCard icon={<Flame />} label="Maratón de diciembre" value="18.450" helper="74% de la meta del grupo" color="coral" />
          <MetricCard icon={<Users />} label="Grupos activos" value="116 / 120" helper="96% reportó actividad" color="teal" />
          <MetricCard icon={<Camera />} label="Evidencias compartidas" value="1.284" helper="62 nuevas esta semana" color="yellow" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)]">
          <div className="rounded-[24px] border border-[#dedff0] bg-white p-5 shadow-[0_10px_35px_rgba(32,36,91,.06)] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-[#20245b]">Ritmo de distribución</h2>
                <p className="mt-1 text-sm text-muted-foreground">Libros registrados por todos los grupos</p>
              </div>
              <Tabs value={period} onValueChange={setPeriod}>
                <TabsList className="h-10 rounded-xl bg-[#f0eff8] p-1">
                  <TabsTrigger value="year" className="h-8 rounded-lg px-3">Todo el año</TabsTrigger>
                  <TabsTrigger value="december" className="h-8 rounded-lg px-3">Maratón</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mb-4 flex items-end gap-3">
              <span className="text-3xl font-black tracking-tight text-[#20245b]">{chartTotal}</span>
              <span className="mb-1 inline-flex items-center rounded-full bg-[#e7f8f2] px-2 py-1 text-xs font-bold text-[#16836a]"><ArrowUpRight className="mr-0.5 size-3" />{chartChange}</span>
            </div>

            <figure className="overflow-hidden" aria-label="Gráfico mensual de libros distribuidos">
              <svg className="h-[220px] w-full overflow-visible" viewBox="0 0 740 250" preserveAspectRatio="none" role="img">
                <defs>
                  <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6558df" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#6558df" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[42, 92, 142, 192, 242].map((y) => <line key={y} x1="0" x2="740" y1={y} y2={y} stroke="#e8e8f2" strokeWidth="1" />)}
                <polygon points={`0,250 ${chartPoints} 740,250`} fill="url(#chart-fill)" />
                <polyline points={chartPoints} fill="none" stroke="#6558df" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" vectorEffect="non-scaling-stroke" />
                <circle cx="722" cy={period === 'year' ? '42' : '26'} r="7" fill="#fff" stroke="#ff6b57" strokeWidth="4" />
              </svg>
              <figcaption className="grid grid-cols-12 gap-1 border-t border-[#eeeef5] pt-3">
                {months.map((month) => <span key={month} className="text-center text-[11px] font-medium text-muted-foreground sm:text-xs">{month}</span>)}
              </figcaption>
            </figure>
          </div>

          <aside className="rounded-[24px] border border-[#dedff0] bg-white p-5 shadow-[0_10px_35px_rgba(32,36,91,.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#20245b]">Grupos destacados</h2>
                <p className="mt-1 text-sm text-muted-foreground">Clasificación anual</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-[#fff5d9] text-[#af7411]"><Trophy className="size-5" /></span>
            </div>
            <ol className="space-y-2">
              {topGroups.map((group, index) => (
                <li key={group.name} className={`flex items-center gap-3 rounded-xl px-2.5 py-3 ${group.name === 'Bogotá Centro' ? 'bg-[#f2f0ff]' : 'hover:bg-[#f8f8fc]'}`}>
                  <span className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-black ${index < 3 ? 'bg-[#20245b] text-white' : 'bg-[#eeeef4] text-[#5f6074]'}`}>{index + 1}</span>
                  <span className={`size-2.5 shrink-0 rounded-full ${group.tone}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#292a45]">{group.name}</span>
                    <span className="block text-xs text-muted-foreground">{group.city}</span>
                  </span>
                  <span className="text-sm font-black tabular-nums text-[#20245b]">{formatNumber(group.books)}</span>
                </li>
              ))}
            </ol>
            <Button variant="ghost" className="mt-3 h-10 w-full justify-between rounded-xl text-[#5144d8] hover:bg-[#f2f0ff] hover:text-[#4236bd]">Ver los 120 grupos <ChevronRight /></Button>
          </aside>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#dedff0] bg-white p-5 shadow-[0_10px_35px_rgba(32,36,91,.06)] sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#20245b]">La comunidad en acción</h2>
              <p className="mt-1 text-sm text-muted-foreground">Historias recientes compartidas por los grupos</p>
            </div>
            <Button variant="ghost" className="hidden text-[#5144d8] sm:inline-flex">Ver actividad <ChevronRight /></Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr_.65fr]">
            <article className="group relative min-h-[290px] overflow-hidden rounded-2xl bg-[#20245b]">
              <Image src="/evidencia-distribucion.png" alt="Voluntarios entregando libros durante una jornada comunitaria" fill priority className="object-cover transition duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16183f]/95 via-[#16183f]/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#ff6b57] px-2.5 py-1 text-xs font-bold"><Flame className="size-3" /> Maratón de diciembre</span>
                <h3 className="text-xl font-black">1.240 libros encontraron nuevos lectores</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-indigo-100"><MapPin className="size-4" /> Medellín Norte · hace 2 horas</p>
              </div>
            </article>

            <ActivityCard icon={<CalendarDays />} accent="bg-[#f2f0ff] text-[#5144d8]" value="680" title="Jornada en tres barrios" meta="Lima Esperanza · ayer" />
            <ActivityCard icon={<Users />} accent="bg-[#e7f8f2] text-[#16836a]" value="425" title="Lectura para familias" meta="Quito Centro · hace 2 días" />
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ icon, label, value, helper, color }: { icon: React.ReactNode; label: string; value: string; helper: string; color: 'violet' | 'coral' | 'teal' | 'yellow' }) {
  const tones = {
    violet: 'bg-[#eeecff] text-[#5144d8]',
    coral: 'bg-[#fff0ed] text-[#dc503c]',
    teal: 'bg-[#e7f8f2] text-[#16836a]',
    yellow: 'bg-[#fff5d9] text-[#af7411]',
  };
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-[#dedff0] bg-white p-4 shadow-[0_8px_28px_rgba(32,36,91,.05)] sm:p-5">
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl [&_svg]:size-5 ${tones[color]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-[#20245b]">{value}</p>
        <p className="mt-1 truncate text-xs font-medium text-[#16836a]">{helper}</p>
      </div>
    </article>
  );
}

function ActivityCard({ icon, accent, value, title, meta }: { icon: React.ReactNode; accent: string; value: string; title: string; meta: string }) {
  return (
    <article className="flex min-h-[220px] flex-col rounded-2xl border border-[#e5e5ef] bg-[#fafafe] p-5 lg:min-h-0">
      <span className={`grid size-11 place-items-center rounded-xl [&_svg]:size-5 ${accent}`}>{icon}</span>
      <div className="mt-auto pt-8">
        <p className="text-4xl font-black tracking-[-0.04em] text-[#20245b]">{value}</p>
        <h3 className="mt-1 font-bold text-[#292a45]">{title}</h3>
        <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
      </div>
    </article>
  );
}

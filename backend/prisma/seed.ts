import { PrismaClient, CandidateStatus, DocumentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Idempotent cleanup — reverse dependency order
  await prisma.document.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.user.deleteMany();

  // ── Users (recruiters) ────────────────────────────────────────────────────
  const alice = await prisma.user.create({
    data: {
      email: 'alice.recruiter@lti.com',
      name: 'Alice Martínez',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob.recruiter@lti.com',
      name: 'Bob García',
    },
  });

  // ── Candidates ────────────────────────────────────────────────────────────
  const candidatesData = [
    {
      userId: alice.id,
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@example.com',
      phone: '+34 611 222 333',
      address: 'Calle Mayor 12, Madrid',
      status: CandidateStatus.ACTIVE,
    },
    {
      userId: alice.id,
      firstName: 'Laura',
      lastName: 'Fernández',
      email: 'laura.fernandez@example.com',
      phone: '+34 622 333 444',
      address: 'Avenida de la Paz 5, Barcelona',
      status: CandidateStatus.IN_PROCESS,
    },
    {
      userId: alice.id,
      firstName: 'Miguel',
      lastName: 'Torres',
      email: 'miguel.torres@example.com',
      phone: '+34 633 444 555',
      address: 'Paseo de Gracia 88, Barcelona',
      status: CandidateStatus.HIRED,
    },
    {
      userId: bob.id,
      firstName: 'Sofía',
      lastName: 'Ruiz',
      email: 'sofia.ruiz@example.com',
      phone: '+34 644 555 666',
      address: 'Gran Vía 42, Madrid',
      status: CandidateStatus.REJECTED,
    },
    {
      userId: bob.id,
      firstName: 'Javier',
      lastName: 'Moreno',
      email: 'javier.moreno@example.com',
      phone: '+34 655 666 777',
      address: 'Calle Serrano 10, Madrid',
      status: CandidateStatus.WITHDRAWN,
    },
    {
      userId: bob.id,
      firstName: 'Elena',
      lastName: 'Díaz',
      email: 'elena.diaz@example.com',
      phone: null,
      address: null,
      status: CandidateStatus.ACTIVE,
    },
  ];

  const candidates = await Promise.all(
    candidatesData.map((data) => prisma.candidate.create({ data })),
  );

  const [carlos, laura, miguel, sofia, javier, elena] = candidates;

  // ── Education ─────────────────────────────────────────────────────────────
  await prisma.education.createMany({
    data: [
      // Carlos — completed degree
      {
        candidateId: carlos.id,
        institution: 'Universidad Complutense de Madrid',
        degree: 'Grado en Ingeniería Informática',
        fieldOfStudy: 'Ingeniería del Software',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-06-30'),
      },
      // Laura — completed + in-progress master
      {
        candidateId: laura.id,
        institution: 'Universitat Politècnica de Catalunya',
        degree: 'Grado en Administración de Empresas',
        fieldOfStudy: 'Recursos Humanos',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-30'),
      },
      {
        candidateId: laura.id,
        institution: 'ESADE Business School',
        degree: 'Máster en Dirección de Personas',
        fieldOfStudy: null,
        startDate: new Date('2023-09-01'),
        endDate: null, // in progress
      },
      // Miguel
      {
        candidateId: miguel.id,
        institution: 'Universitat de Barcelona',
        degree: 'Grado en Psicología',
        fieldOfStudy: 'Psicología Organizacional',
        startDate: new Date('2013-09-01'),
        endDate: new Date('2017-06-30'),
      },
      // Sofía
      {
        candidateId: sofia.id,
        institution: 'Universidad de Sevilla',
        degree: 'Grado en Marketing',
        fieldOfStudy: 'Marketing Digital',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-06-30'),
      },
      // Javier
      {
        candidateId: javier.id,
        institution: 'IE Business School',
        degree: 'MBA',
        fieldOfStudy: null,
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-30'),
      },
      // Elena — in progress
      {
        candidateId: elena.id,
        institution: 'Universidad Autónoma de Madrid',
        degree: 'Grado en Ciencias de Datos',
        fieldOfStudy: 'Machine Learning',
        startDate: new Date('2022-09-01'),
        endDate: null, // in progress
      },
    ],
  });

  // ── Work Experience ───────────────────────────────────────────────────────
  await prisma.workExperience.createMany({
    data: [
      // Carlos — previous + current
      {
        candidateId: carlos.id,
        company: 'Indra',
        position: 'Desarrollador Junior',
        startDate: new Date('2018-07-01'),
        endDate: new Date('2021-03-31'),
        description: 'Desarrollo de aplicaciones web con Java Spring Boot y Angular.',
      },
      {
        candidateId: carlos.id,
        company: 'Telefónica Tech',
        position: 'Desarrollador Senior',
        startDate: new Date('2021-04-01'),
        endDate: null, // current job
        description:
          'Arquitectura de microservicios, Node.js y AWS. Liderazgo técnico de equipo de 4 personas.',
      },
      // Laura
      {
        candidateId: laura.id,
        company: 'ManpowerGroup',
        position: 'Técnica de Selección',
        startDate: new Date('2019-09-01'),
        endDate: new Date('2022-12-31'),
        description: 'Selección de perfiles técnicos y administrativos para clientes del sector financiero.',
      },
      {
        candidateId: laura.id,
        company: 'Adecco',
        position: 'Consultora de RRHH',
        startDate: new Date('2023-01-01'),
        endDate: null, // current job
        description: null,
      },
      // Miguel
      {
        candidateId: miguel.id,
        company: 'Leroy Merlin',
        position: 'Técnico de Recursos Humanos',
        startDate: new Date('2017-10-01'),
        endDate: new Date('2020-09-30'),
        description: 'Gestión del clima laboral y planes de formación.',
      },
      {
        candidateId: miguel.id,
        company: 'Grupo Inditex',
        position: 'HR Business Partner',
        startDate: new Date('2020-10-01'),
        endDate: new Date('2023-06-30'),
        description: 'Soporte estratégico al negocio en materia de talento y desarrollo organizacional.',
      },
      // Sofía
      {
        candidateId: sofia.id,
        company: 'Heineken España',
        position: 'Analista de Marketing Digital',
        startDate: new Date('2020-07-01'),
        endDate: new Date('2022-07-31'),
        description: 'Gestión de campañas en redes sociales y análisis de métricas.',
      },
      // Javier
      {
        candidateId: javier.id,
        company: 'Banco Santander',
        position: 'Project Manager',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2023-09-30'),
        description: 'Gestión de proyectos de transformación digital en el área de banca minorista.',
      },
      // Elena — current (student worker)
      {
        candidateId: elena.id,
        company: 'NTT Data',
        position: 'Analista de Datos Junior',
        startDate: new Date('2024-02-01'),
        endDate: null, // current job
        description: 'Prácticas profesionales en proyectos de análisis de datos con Python y SQL.',
      },
    ],
  });

  // ── Documents (CV per candidate) ──────────────────────────────────────────
  const cvData = [
    { candidate: carlos, file: 'carlos-lopez-cv.pdf', size: 142_320 },
    { candidate: laura, file: 'laura-fernandez-cv.pdf', size: 198_450 },
    { candidate: miguel, file: 'miguel-torres-cv.pdf', size: 115_680 },
    { candidate: sofia, file: 'sofia-ruiz-cv.pdf', size: 203_100 },
    { candidate: javier, file: 'javier-moreno-cv.pdf', size: 178_900 },
    { candidate: elena, file: 'elena-diaz-cv.pdf', size: 95_230 },
  ];

  await prisma.document.createMany({
    data: cvData.map(({ candidate, file, size }) => ({
      candidateId: candidate.id,
      fileUri: `fs://uploads/cv/${candidate.id}.pdf`,
      fileName: file,
      mimeType: 'application/pdf',
      size,
      type: DocumentType.CV,
    })),
  });

  console.log(
    `Seeded: 2 users, ${candidates.length} candidates, education records, work experience records, and CV documents.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

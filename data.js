const TEACHER_CODE = '041626';
const STORAGE_KEY = 'unidad1_empresa_organizacion_progreso_v3';

const PHASES = [
  {
    id: 'fase-1',
    number: 1,
    title: 'Mapa conceptual guiado',
    subtitle: 'Síntesis visual del tema',
    theory: [
      {
        title: 'Objetivo de la fase',
        text: 'Completar un mapa conceptual inspirado en el esquema del tema para relacionar empresa, organización, función directiva, información y comunicación.'
      },
      {
        title: 'Pista didáctica',
        text: 'No se trata de copiar mecánicamente. El alumnado debe identificar bloques, jerarquías y relaciones entre conceptos para reconstruir el contenido con sentido.'
      }
    ],
    map: {
      columns: [
        {
          title: 'Empresa y clasificación',
          blanks: ['Elementos y funciones', 'Dirección de empresa', 'Clasificación según propiedad', 'Clasificación según tamaño', 'Clasificación según sector', 'Ámbito geográfico', 'Naturaleza jurídica']
        },
        {
          title: 'Organización empresarial',
          blanks: ['División del trabajo', 'Especialización', 'Autoridad', 'Jerarquía', 'Participación', 'Organización formal', 'Organización informal']
        },
        {
          title: 'Funciones, dirección y comunicación',
          blanks: ['Áreas funcionales', 'Departamentalización', 'Estructura organizativa', 'Función directiva', 'Sistema de información', 'Comunicación interna', 'Comunicación externa']
        }
      ]
    },
    practices: [
      {
        id: 'f1_p1',
        title: 'Reconstrucción del mapa',
        prompt: 'Completa los huecos del mapa y explica, en 6-8 líneas, cómo se conectan empresa, organización y comunicación dentro de una empresa.'
      },
      {
        id: 'f1_p2',
        title: 'Síntesis personal',
        prompt: 'Redacta una mini-síntesis con tres ideas clave del tema que te hayan ayudado a completar el mapa.'
      }
    ]
  },
  {
    id: 'fase-2',
    number: 2,
    title: 'La empresa: elementos, funciones y clasificación',
    subtitle: 'Base conceptual del tema',
    theory: [
      {
        title: 'Ideas clave',
        text: 'La empresa combina personas, bienes y recursos financieros para producir bienes o prestar servicios y satisfacer necesidades a cambio de un beneficio.'
      },
      {
        title: 'Qué debes dominar',
        text: 'Elementos empresariales, funciones directivas, tipos de empresa según propiedad, tamaño, sector, ámbito geográfico y naturaleza jurídica.'
      }
    ],
    badges: ['Factor humano', 'Capital', 'Entorno', 'Planificar', 'Organizar', 'Gestionar', 'Controlar'],
    practices: [
      {
        id: 'f2_p1',
        title: 'Caso aplicado',
        prompt: 'Compara dos empresas reales o cercanas (por ejemplo, una cafetería de barrio y la cafetería de un centro educativo): fines, objetivos, funciones y forma de competir.'
      },
      {
        id: 'f2_p2',
        title: 'Clasificación completa',
        prompt: 'Elige una empresa conocida y clasifícala según todos los criterios estudiados. Justifica cada decisión con lenguaje económico preciso.'
      }
    ],
    test: { pool: 'empresa' }
  },
  {
    id: 'fase-3',
    number: 3,
    title: 'Organización empresarial',
    subtitle: 'Principios y tipos de organización',
    theory: [
      {
        title: 'Principios organizativos',
        text: 'La organización empresarial se apoya en la división del trabajo, la especialización, la autoridad, la jerarquía y la participación para coordinar tareas y personas.'
      },
      {
        title: 'Tipos de organización',
        text: 'La organización formal responde a una estructura definida por la dirección; la informal surge espontáneamente de las relaciones personales dentro de la empresa.'
      }
    ],
    practices: [
      {
        id: 'f3_p1',
        title: 'Análisis de situaciones',
        prompt: 'Redacta un ejemplo realista de cada principio organizativo dentro de una empresa del sector servicios.'
      },
      {
        id: 'f3_p2',
        title: 'Formal vs. informal',
        prompt: 'Elabora una comparación estructurada entre organización formal e informal: origen, autoridad, estructura, ventajas y riesgos.'
      }
    ],
    test: { pool: 'organizacion' }
  },
  {
    id: 'fase-4',
    number: 4,
    title: 'Desarrollo de funciones dentro de la empresa',
    subtitle: 'Áreas funcionales, departamentalización y estructura',
    theory: [
      {
        title: 'Áreas funcionales',
        text: 'Las áreas funcionales agrupan actividades homogéneas: recursos humanos, comercial, financiera, administrativa, aprovisionamiento y producción.'
      },
      {
        title: 'Estructura',
        text: 'La empresa puede organizarse mediante estructuras jerárquicas, funcionales o mixtas. La departamentalización puede ser funcional, territorial, por productos o por procesos.'
      }
    ],
    practices: [
      {
        id: 'f4_p1',
        title: 'Funciones y departamentos',
        prompt: 'Relaciona diez actividades empresariales con el área funcional o departamento responsable. Añade una breve justificación de cada relación.'
      },
      {
        id: 'f4_p2',
        title: 'Diseño de organigrama',
        prompt: 'Diseña el organigrama básico de una empresa ficticia e indica qué modelo estructural has elegido y por qué.'
      }
    ],
    test: { pool: 'funciones' }
  },
  {
    id: 'fase-5',
    number: 5,
    title: 'La función directiva',
    subtitle: 'Niveles, estilos y teorías de dirección',
    theory: [
      {
        title: 'Niveles directivos',
        text: 'Alta dirección, nivel intermedio y nivel operativo o de gestión cumplen funciones distintas pero complementarias en la planificación y supervisión empresarial.'
      },
      {
        title: 'Estilos de dirección',
        text: 'Los estilos autoritario, participativo y permisivo generan efectos diferentes sobre la motivación, la autonomía y la responsabilidad. También deben entenderse las teorías X, Y y Z.'
      }
    ],
    practices: [
      {
        id: 'f5_p1',
        title: 'Análisis de liderazgo',
        prompt: 'Describe una situación de dirección en una empresa o institución y analiza el estilo de liderazgo observado, sus ventajas y sus riesgos.'
      },
      {
        id: 'f5_p2',
        title: 'Comparativa crítica',
        prompt: 'Compara los estilos autoritario, participativo y permisivo. Explica cuál sería más adecuado en una empresa que quiera innovar sin perder control.'
      }
    ],
    test: { pool: 'direccion' }
  },
  {
    id: 'fase-6',
    number: 6,
    title: 'La información en la actividad empresarial',
    subtitle: 'Sistema de información y protección',
    theory: [
      {
        title: 'Sistema de información',
        text: 'Un sistema de información integra hardware, software, datos, procedimientos y personas para recopilar, procesar, almacenar y distribuir información útil.'
      },
      {
        title: 'Seguridad de la información',
        text: 'La empresa debe proteger la información confidencial mediante restricción de acceso, protocolos internos y cláusulas de confidencialidad.'
      }
    ],
    practices: [
      {
        id: 'f6_p1',
        title: 'Circuito informativo',
        prompt: 'Explica con un ejemplo cómo se relaciona un departamento de atención al cliente con otros departamentos a través del sistema de información.'
      },
      {
        id: 'f6_p2',
        title: 'Protección de datos empresariales',
        prompt: 'Propón un protocolo básico para proteger información sensible dentro de una empresa mediana.'
      }
    ],
    test: { pool: 'informacion' }
  },
  {
    id: 'fase-7',
    number: 7,
    title: 'Comunicación empresarial e imagen corporativa',
    subtitle: 'Comunicación interna, externa y cultura corporativa',
    theory: [
      {
        title: 'Comunicación interna',
        text: 'Puede circular por canales formales y oficiales o por vías informales. Los rumores aparecen con facilidad cuando falta claridad o existe incertidumbre.'
      },
      {
        title: 'Comunicación externa',
        text: 'Publicidad, relaciones públicas, venta personal, marketing y promoción de ventas influyen directamente en la imagen y cultura corporativas.'
      }
    ],
    practices: [
      {
        id: 'f7_p1',
        title: 'Plan de comunicación',
        prompt: 'Diseña un mini plan de comunicación interna y externa para una empresa ficticia, indicando canales, mensajes y objetivos.'
      },
      {
        id: 'f7_p2',
        title: 'Imagen corporativa',
        prompt: 'Analiza cómo cinco actuaciones de una empresa podrían mejorar o empeorar su imagen ante clientes, proveedores y sociedad.'
      }
    ],
    test: { pool: 'comunicacion' }
  },
  {
    id: 'fase-8',
    number: 8,
    title: 'Reto final integrador',
    subtitle: 'Proyecto aplicado y evaluación final',
    theory: [
      {
        title: 'Tarea integradora',
        text: 'Crea una empresa ficticia, define su actividad, clasifícala, diseña su estructura, representa su organigrama y plantea su identidad y comunicación corporativas.'
      },
      {
        title: 'Cierre',
        text: 'Esta fase resume todo el tema y sirve como evidencia final para valorar el logro del resultado de aprendizaje.'
      }
    ],
    practices: [
      {
        id: 'f8_p1',
        title: 'Proyecto de empresa',
        prompt: 'Presenta tu empresa ficticia: nombre, actividad, clasificación, cultura corporativa, estructura organizativa y áreas funcionales.'
      },
      {
        id: 'f8_p2',
        title: 'Comunicación e identidad',
        prompt: 'Describe cómo se comunicaría con trabajadores, clientes y público en general. Añade propuestas para su imagen corporativa.'
      }
    ],
    test: { pool: 'global' }
  }
];

const QUESTION_POOLS = {
  empresa: [
    { q: '¿Qué definición describe mejor a la empresa dentro del módulo?', options: ['Una organización integrada por personas, bienes y recursos financieros que produce bienes o servicios para satisfacer necesidades y obtener un beneficio.', 'Un grupo informal de trabajadores que se coordina sin objetivos económicos ni sociales definidos.', 'Una institución pública dedicada exclusivamente a regular el mercado y fijar precios obligatorios.', 'Una actividad individual que no requiere recursos materiales ni organización previa.'], correct: 0 },
    { q: '¿Cuál de los siguientes elementos forma parte del factor humano de la empresa?', options: ['La maquinaria de la fábrica y las existencias en almacén.', 'El empresario, la plantilla y, en ocasiones, el propietario capitalista.', 'El software de gestión y la red de comunicaciones.', 'El edificio social y la marca comercial.'], correct: 1 },
    { q: 'La función de planificar consiste en…', options: ['ejecutar rutinariamente las tareas diarias sin revisar objetivos previos.', 'analizar únicamente los resultados contables del final del ejercicio.', 'fijar objetivos, establecer estrategias y definir políticas para alcanzarlos.', 'delegar todas las decisiones en los niveles operativos.'], correct: 2 },
    { q: 'Una empresa pública se caracteriza porque…', options: ['su capital pertenece en todo o en parte al Estado o a una entidad pública con influencia decisiva en la gestión.', 'solo puede actuar dentro del ámbito local.', 'debe dedicarse obligatoriamente al sector primario.', 'carece de organización formal y funciona por relaciones espontáneas.'], correct: 0 },
    { q: 'Según el tamaño, una microempresa suele contar con…', options: ['más de 250 trabajadores.', 'entre 51 y 250 trabajadores.', 'entre 1 y 9 trabajadores.', 'exactamente 50 trabajadores.'], correct: 2 },
    { q: 'Una empresa del sector terciario se dedica principalmente a…', options: ['extraer recursos naturales.', 'transformar materias primas en bienes.', 'prestar servicios.', 'emitir legislación mercantil.'], correct: 2 },
    { q: 'Cuando una empresa opera en varios países, se clasifica por ámbito geográfico como…', options: ['regional.', 'multinacional.', 'comanditaria.', 'cooperativa.'], correct: 1 },
    { q: 'En las sociedades capitalistas, lo más relevante es…', options: ['la aportación de capital realizada por cada socio.', 'la amistad entre los socios fundadores.', 'la existencia de un solo jefe directo.', 'el origen territorial de la empresa.'], correct: 0 }
  ],
  organizacion: [
    { q: 'La división del trabajo busca principalmente…', options: ['sustituir la autoridad por relaciones espontáneas.', 'convertir un proceso complejo en tareas más pequeñas y coordinadas.', 'eliminar la especialización para que todos hagan de todo.', 'reducir la comunicación interna al mínimo.'], correct: 1 },
    { q: 'La especialización favorece la eficiencia porque…', options: ['permite mayor entrenamiento y dominio de tareas concretas.', 'elimina la necesidad de coordinación entre departamentos.', 'hace innecesaria la formación continua.', 'impide que se creen departamentos funcionales.'], correct: 0 },
    { q: 'La jerarquía en una empresa implica…', options: ['ausencia total de niveles de responsabilidad.', 'existencia de distintos niveles de autoridad y responsabilidad.', 'que solo exista organización informal.', 'que la empresa pertenezca al Estado.'], correct: 1 },
    { q: 'La participación se relaciona con…', options: ['el compromiso de los trabajadores con la empresa y su implicación en decisiones o mejoras.', 'la prohibición de aportar ideas.', 'la desaparición de las normas internas.', 'el uso exclusivo de rumores como canal de comunicación.'], correct: 0 },
    { q: 'La organización formal…', options: ['surge espontáneamente entre compañeros.', 'se diseña intencionadamente por la dirección para coordinar actividades y controlar la empresa.', 'carece de estructura y autoridad.', 'solo existe en empresas muy pequeñas.'], correct: 1 },
    { q: 'La organización informal…', options: ['solo puede existir en la administración pública.', 'nace de las relaciones personales y grupos espontáneos dentro de la empresa.', 'se refleja siempre en el organigrama oficial.', 'sustituye por completo a la organización formal.'], correct: 1 },
    { q: '¿Qué enunciado diferencia mejor organización formal e informal?', options: ['La formal depende de relaciones personales; la informal la define la dirección.', 'La formal establece responsabilidades y autoridad; la informal surge de vínculos personales y liderazgo social.', 'La formal solo se usa en empresas industriales; la informal en empresas de servicios.', 'La formal evita toda comunicación; la informal se basa en documentos escritos.'], correct: 1 },
    { q: 'Cuando un equipo propone mejoras y se siente implicado en los objetivos, se refuerza especialmente el principio de…', options: ['participación.', 'multinacionalidad.', 'patrimonialidad.', 'titularidad pública.'], correct: 0 }
  ],
  funciones: [
    { q: '¿Cuál de estas áreas funcionales gestiona contratación, formación y clima laboral?', options: ['Área financiera.', 'Área de recursos humanos.', 'Área de aprovisionamiento.', 'Área comercial.'], correct: 1 },
    { q: 'El área comercial se ocupa principalmente de…', options: ['estudiar el mercado e introducir y vender el producto o servicio.', 'redactar balances y cuentas anuales exclusivamente.', 'fabricar bienes y transformar materias primas.', 'establecer la estructura jerárquica del organigrama.'], correct: 0 },
    { q: 'La departamentalización consiste en…', options: ['separar a los trabajadores para evitar la cooperación.', 'agrupar actividades similares en áreas, departamentos o divisiones.', 'eliminar toda autoridad intermedia.', 'convertir la empresa en una cooperativa.'], correct: 1 },
    { q: '¿Cuál de estos es un criterio de departamentalización?', options: ['Por procesos de producción.', 'Por simpatía entre trabajadores.', 'Por preferencia horaria individual.', 'Por antigüedad exclusiva.'], correct: 0 },
    { q: 'En la organización jerárquica, cada trabajador…', options: ['depende de varios especialistas a la vez.', 'responde ante un único jefe directo.', 'carece de supervisión.', 'solo recibe órdenes informales.'], correct: 1 },
    { q: 'La organización funcional se caracteriza porque…', options: ['cada trabajador recibe orientación de especialistas según funciones concretas.', 'nadie ejerce autoridad sobre nadie.', 'solo sirve para empresas públicas.', 'el organigrama desaparece.'], correct: 0 },
    { q: 'La organización mixta o jerárquico-funcional…', options: ['combina la unidad de mando con el asesoramiento de especialistas.', 'elimina el uso de expertos.', 'impide la creación de departamentos.', 'solo puede aplicarse en microempresas.'], correct: 0 },
    { q: 'Un organigrama es…', options: ['la descripción oral de la cultura corporativa.', 'la representación gráfica de la estructura organizativa.', 'el conjunto de rumores de la empresa.', 'un balance contable anual.'], correct: 1 }
  ],
  direccion: [
    { q: 'La alta dirección se ocupa sobre todo de…', options: ['planificar a largo plazo y supervisar globalmente la empresa.', 'asignar tareas rutinarias diarias en la cadena operativa.', 'registrar la correspondencia administrativa.', 'controlar solo la producción material.'], correct: 0 },
    { q: 'El nivel intermedio…', options: ['traduce la planificación general en planes más concretos y coordina equipos.', 'sustituye completamente a la alta dirección.', 'carece de responsabilidad sobre personas.', 'se limita a ejecutar tareas manuales.'], correct: 0 },
    { q: 'El estilo autoritario de dirección se caracteriza porque…', options: ['los subordinados deciden sin límites.', 'el directivo decide y ordena sin consultar.', 'la empresa funciona solo con rumores.', 'no existe ningún grado de autoridad.'], correct: 1 },
    { q: 'En un estilo participativo…', options: ['los empleados obedecen sin opinar.', 'el directivo mantiene equilibrio entre autoridad y colaboración de los subordinados.', 'no hay normas ni control.', 'la dirección se delega fuera de la empresa.'], correct: 1 },
    { q: 'El estilo permisivo supone que…', options: ['los empleados trabajan con mayor autonomía dentro de límites definidos por el directivo.', 'toda decisión debe ser aprobada por la alta dirección por escrito.', 'se elimina la responsabilidad individual.', 'solo el empresario puede actuar.'], correct: 0 },
    { q: 'Según la teoría X, los empleados…', options: ['buscan espontáneamente responsabilidades y creatividad.', 'necesitan presión porque se presupone aversión al trabajo.', 'se autorregulan perfectamente siempre.', 'prefieren participar en consenso continuo.'], correct: 1 },
    { q: 'La teoría Y considera que las personas…', options: ['quieren evitar el trabajo y rechazan responsabilidades.', 'pueden encontrar en el trabajo una fuente de realización y asumir responsabilidades.', 'solo obedecen si existe castigo.', 'rechazan por naturaleza la creatividad.'], correct: 1 },
    { q: 'La teoría Z destaca, entre otros aspectos…', options: ['consenso en la toma de decisiones y responsabilidad colectiva.', 'rotación acelerada y promoción inmediata.', 'ausencia de cultura corporativa.', 'prohibición de la participación.'], correct: 0 }
  ],
  informacion: [
    { q: 'Un sistema de información empresarial integra…', options: ['solo ordenadores y conexión a internet.', 'hardware, software, datos, procedimientos y personas.', 'únicamente bases de datos contables.', 'solo documentos en papel.'], correct: 1 },
    { q: 'Los usuarios del sistema de información son…', options: ['las personas que reciben y comunican información.', 'solo los clientes externos.', 'únicamente los técnicos informáticos.', 'los proveedores de materias primas.'], correct: 0 },
    { q: 'El soporte dentro del sistema de información incluye…', options: ['solo la comunicación oral entre compañeros.', 'equipos y programas utilizados para almacenar, procesar y comunicar la información.', 'solamente archivos históricos en papel.', 'solo cláusulas de confidencialidad.'], correct: 1 },
    { q: 'La información confidencial debe protegerse porque…', options: ['carece de valor para la empresa.', 'su contenido es sensible y su acceso debe limitarse a personas autorizadas.', 'solo interesa a competidores extranjeros.', 'debe circular libremente para mejorar rumores.'], correct: 1 },
    { q: 'Una medida adecuada para proteger la información empresarial es…', options: ['compartir contraseñas entre departamentos para agilizar el trabajo.', 'restringir accesos y establecer cláusulas de confidencialidad.', 'enviar todos los documentos sin cifrado.', 'eliminar cualquier registro de actividad.'], correct: 1 },
    { q: 'El flujo de información interna es…', options: ['el intercambio de información entre miembros de la empresa.', 'la publicidad dirigida al consumidor final.', 'la venta personal fuera de la organización.', 'la difusión de rumores en medios de comunicación.'], correct: 0 }
  ],
  comunicacion: [
    { q: 'La comunicación, a diferencia de la información, implica…', options: ['la posibilidad de interacción e intercambio entre personas.', 'solo transmisión unidireccional sin respuesta.', 'únicamente soporte documental.', 'ausencia de feedback.'], correct: 0 },
    { q: 'La comunicación interna se produce…', options: ['entre la empresa y sus clientes exclusivamente.', 'entre los departamentos y miembros de la propia estructura organizativa.', 'solo en campañas publicitarias.', 'únicamente a través de redes sociales.'], correct: 1 },
    { q: 'Los canales formales y oficiales son…', options: ['los establecidos deliberadamente por la política de comunicación de la empresa.', 'las conversaciones espontáneas de pasillo.', 'las amistades surgidas fuera del trabajo.', 'los comentarios anónimos en internet.'], correct: 0 },
    { q: 'Los rumores dentro de la empresa son…', options: ['datos verificables publicados por la dirección.', 'especulaciones que circulan sin pruebas suficientes de veracidad.', 'el principal instrumento de la contabilidad.', 'canales externos de publicidad.'], correct: 1 },
    { q: '¿Cuál de estas acciones pertenece a la comunicación externa?', options: ['Publicidad y relaciones públicas.', 'Conversación informal entre dos compañeros.', 'Cambio de turnos entre operarios.', 'Reunión interna de coordinación.'], correct: 0 },
    { q: 'La imagen corporativa puede definirse como…', options: ['la percepción que el público externo tiene de la empresa.', 'el conjunto de rumores internos.', 'el listado de máquinas productivas.', 'la suma de documentos administrativos archivados.'], correct: 0 },
    { q: 'La cultura corporativa es…', options: ['el conjunto de creencias, valores, comportamientos y normas compartidos por la organización.', 'el número de departamentos existentes.', 'la cuantía del capital social.', 'la clasificación jurídica de la empresa.'], correct: 0 },
    { q: 'Una mala gestión de la comunicación externa puede…', options: ['mejorar automáticamente la reputación.', 'afectar negativamente a la imagen y confianza del público.', 'reducir la necesidad de coordinar canales.', 'hacer innecesario el marketing.'], correct: 1 }
  ],
  global: []
};

QUESTION_POOLS.global = [
  ...QUESTION_POOLS.empresa,
  ...QUESTION_POOLS.organizacion,
  ...QUESTION_POOLS.funciones,
  ...QUESTION_POOLS.direccion,
  ...QUESTION_POOLS.informacion,
  ...QUESTION_POOLS.comunicacion
];

# How to update the website / Cómo actualizar el sitio

**Hispanic Society of Kamloops / Sociedad Hispana de Kamloops**  
A short guide for the board and volunteers. You do not need to write code.

---

## English

### The easiest way: Pages CMS

1. Ask tresD (or whoever manages the GitHub repository) to invite a Society Google/GitHub account as a collaborator on the `hispanic-society-kamloops` repository.
2. Open [https://app.pagescms.org](https://app.pagescms.org) and sign in with that GitHub account.
3. Choose the repository **adrianvo85/hispanic-society-kamloops**.
4. Edit the collection you need (Events, Board, Sponsors, Volunteer roles, Resolutions, Site settings).
5. Save. GitHub Actions will rebuild the public site, usually within a few minutes.

There is also an optional editor at `/admin/` (Decap CMS). It needs a one-time free GitHub OAuth setup before login works. Until then, use Pages CMS.

### What you can change

| You want to… | Open… | Tips |
| --- | --- | --- |
| Add or edit an event, Zeffy ticket link, date or poster | **Events** | Use status `upcoming` or `past`. Put times in 24-hour format, Vancouver time (for example `17:00`). Add gallery images under Gallery. |
| Change the donation button | **Site settings → Zeffy donation URL** | Leave it blank until a real Zeffy donation page exists. |
| Add a board member | **Board** | Turn on “Permission to publish” only when the person has agreed. Until then, leave the placeholder. Never publish a home address or family information. |
| Add minutes or a resolution | **Resolutions and minutes** | Upload a PDF. Do not mark real records as “Example only.” |
| Add a sponsor logo | **Sponsors** | Use a PNG or SVG with a transparent or clean background. Logos should appear on the site within 10 days of approval. |
| Change volunteer roles | **Volunteer roles** | Example roles are marked as placeholders until the board confirms them. |
| Connect the volunteer or sponsor forms | **Site settings** | Create a free form at [formspree.io](https://formspree.io) (or a Google Form) and paste the URL, replacing the `TODO_…` placeholder. |

### Photos

Use posters and photos the Society owns or has permission to share. Do not publish identifiable photos of children without permission.

### Facebook updates

A scheduled job can copy posts, photos and events from the Facebook page into the site every few hours. It only runs when a **page admin** has authorized a Page access token and that token has been saved as the GitHub secret `FB_PAGE_TOKEN` (optional: `FB_PAGE_ID`). tresD can help with this one-time step. The token must never be pasted into a public page or committed to the repository.

### After you save

Wait a few minutes and refresh the live site. If something looks wrong, you can revert the change in Pages CMS or ask tresD for help: [https://tresd.ca](https://tresd.ca).

---

## Español

### La forma más sencilla: Pages CMS

1. Pide a tresD (o a quien administre el repositorio de GitHub) que invite una cuenta de la sociedad como colaboradora en el repositorio `hispanic-society-kamloops`.
2. Entra a [https://app.pagescms.org](https://app.pagescms.org) e inicia sesión con esa cuenta de GitHub.
3. Elige el repositorio **adrianvo85/hispanic-society-kamloops**.
4. Edita la colección que necesites (Eventos, Mesa directiva, Patrocinadores, Roles de voluntariado, Resoluciones, Configuración).
5. Guarda. GitHub Actions volverá a construir el sitio público, por lo general en unos minutos.

También hay un editor opcional en `/admin/` (Decap CMS). Requiere un arreglo gratuito de OAuth con GitHub para poder entrar. Mientras tanto, usa Pages CMS.

### Qué puedes cambiar

| Quieres… | Abre… | Consejos |
| --- | --- | --- |
| Agregar o editar un evento, el enlace de Zeffy, la fecha o el afiche | **Events** | Usa el estado `upcoming` o `past`. Las horas van en formato de 24 horas, hora de Vancouver (por ejemplo `17:00`). Agrega fotos en Gallery. |
| Cambiar el botón de donar | **Site settings → Zeffy donation URL** | Déjalo vacío hasta que exista una página real de donación en Zeffy. |
| Agregar a alguien de la mesa | **Board** | Activa “Permission to publish” solo cuando esa persona lo haya autorizado. Hasta entonces, deja el placeholder. Nunca publiques un domicilio ni información familiar. |
| Agregar un acta o una resolución | **Resolutions and minutes** | Sube un PDF. No marques como “Example only” un documento real. |
| Agregar el logo de un patrocinador | **Sponsors** | Usa PNG o SVG con fondo transparente o limpio. Los logos deben verse en el sitio dentro de los 10 días posteriores a la aprobación. |
| Cambiar roles de voluntariado | **Volunteer roles** | Los roles de ejemplo están marcados como placeholder hasta que la mesa los confirme. |
| Conectar los formularios | **Site settings** | Crea un formulario gratis en [formspree.io](https://formspree.io) (o un Google Form) y pega la URL, en lugar del `TODO_…`. |

### Fotos

Usa afiches y fotos de las que la sociedad sea dueña o tenga permiso. No publiques fotos identificables de menores sin autorización.

### Actualizaciones de Facebook

Un proceso programado puede copiar publicaciones, fotos y eventos de la página de Facebook al sitio cada pocas horas. Solo funciona cuando un **administrador de la página** autoriza un token de acceso y ese token se guarda como secreto de GitHub `FB_PAGE_TOKEN` (opcional: `FB_PAGE_ID`). tresD puede ayudar con ese paso único. El token nunca debe pegarse en una página pública ni subirse al repositorio.

### Después de guardar

Espera unos minutos y recarga el sitio. Si algo se ve mal, puedes deshacer el cambio en Pages CMS o pedir ayuda a tresD: [https://tresd.ca](https://tresd.ca).

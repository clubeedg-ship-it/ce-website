// Privacy policy + legal notice copy. Terms are carried over from the existing legal page; the privacy policy is
// updated to describe the v3 enquiry form, the lead log and retention accurately.
import type { Lang } from '../lib/routes';

export type Block = { h?: string; p?: string[]; ul?: string[]; dl?: [string, string][] };

export const privacyUpdated: Record<Lang, string> = { en: 'Last updated: 21 October 2026', nl: 'Laatst bijgewerkt: 21 oktober 2026' };

export const privacy: Record<Lang, { eyebrow: string; h1: string; lead: string; blocks: Block[]; ctaTitle: string; ctaText: string }> = {
  en: {
    eyebrow: 'Privacy policy', h1: 'How we protect your data',
    lead: 'This site uses no cookies, no analytics and no third-party services. The only personal data we receive is what you choose to send us in the enquiry form.',
    blocks: [
      { h: '1. Data controller', p: ['CuttingEdge is responsible for processing your personal data as described in this policy.'], dl: [['Address', 'Ookmeerweg 101, 1068AP Amsterdam, The Netherlands'], ['Email', 'klucas.lucas@gmail.com'], ['Phone', '+31 6 47 63 97 02'], ['KvK', '34153096']] },
      { h: '2. What we collect', p: ['When you submit the enquiry form we receive the following, all of which you type or select yourself:'], ul: ['Project type and the services you are interested in', 'Project location, approximate size, budget band and timeline', 'Your name and email address, and your phone number if you give one', 'The message you write, and the consent you tick', 'A one-way hash of your IP address (not the address itself), used only to limit abuse. It is not used to identify you.'], },
      { h: '3. What we do not collect', p: ['We do not use cookies, tracking pixels, analytics, advertising tools, embedded maps or social-media widgets. Fonts, images and videos are served from this site only, so your browser makes no requests to other companies when you visit. Contact buttons for WhatsApp or email only open those services when you click them, and then their own policies apply.'] },
      { h: '4. How we use your data', p: ['We use your data only to:'], ul: ['Respond to your enquiry', 'Advise on our services and discuss a possible project', 'Keep a record of the enquiry so that none is lost'] },
      { h: '5. Legal basis', p: ['We process your data on the basis of your consent (Article 6(1)(a) GDPR), which you give by ticking the consent box and submitting the form. You can withdraw your consent at any time by contacting us.'] },
      { h: '6. How the form works and where data is stored', p: ['When you press send, your enquiry is transmitted to our web server over an encrypted connection. The server does two things: it emails the enquiry to the studio mailbox, and it appends it to an access-protected enquiry log kept on the same web server, so that no enquiry is lost if an email does not arrive. The log is not accessible from the web.'] },
      { h: '7. Retention', p: ['If no business relationship is established, we delete your enquiry, from the log and from the mailbox, within 12 months of receiving it. If we start working together we retain the information for the duration of the relationship and any subsequent legal retention period. Anti-abuse records (hashed IP and timestamps) are deleted automatically within one hour.'] },
      { h: '8. Sharing', p: ['We do not sell, trade or share your personal data. Our web hosting provider and our email provider process data on our behalf as processors, solely to deliver the website and the email. Your data is not used for any other purpose.'] },
      { h: '9. Security', p: ['We take appropriate technical and organisational measures to protect your data against unauthorised access, alteration, disclosure or destruction, including encrypted transport (HTTPS), access-restricted storage and spam protection that does not rely on tracking.'] },
      { h: '10. Your rights', p: ['Under the GDPR you have the right to:'], ul: ['Access: obtain a copy of your personal data', 'Rectification: correct inaccurate data', 'Erasure: request deletion of your data', 'Restriction: limit how we use your data', 'Portability: receive your data in a structured format', 'Object to certain processing', 'Withdraw consent at any time'], },
      { p: ['To exercise any of these rights, email klucas.lucas@gmail.com.'] },
      { h: '11. Complaints', p: ['If you believe we have not handled your data appropriately, you can lodge a complaint with the Dutch Data Protection Authority: Autoriteit Persoonsgegevens, Bezuidenhoutseweg 30, 2594 AV Den Haag, autoriteitpersoonsgegevens.nl.'] },
      { h: '12. Changes', p: ['We may update this policy from time to time. Changes are posted on this page with a new revision date.'] },
    ],
    ctaTitle: 'Questions about your privacy?', ctaText: 'Contact us and we will answer personally.',
  },
  nl: {
    eyebrow: 'Privacybeleid', h1: 'Zo beschermen wij uw gegevens',
    lead: 'Deze site gebruikt geen cookies, geen analytics en geen diensten van derden. De enige persoonsgegevens die wij ontvangen zijn de gegevens die u zelf via het aanvraagformulier verstuurt.',
    blocks: [
      { h: '1. Verwerkingsverantwoordelijke', p: ['CuttingEdge is verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in dit beleid.'], dl: [['Adres', 'Ookmeerweg 101, 1068AP Amsterdam, Nederland'], ['E-mail', 'klucas.lucas@gmail.com'], ['Telefoon', '+31 6 47 63 97 02'], ['KvK', '34153096']] },
      { h: '2. Wat wij verzamelen', p: ['Wanneer u het aanvraagformulier verstuurt ontvangen wij het volgende, dat u allemaal zelf invult of selecteert:'], ul: ['Projecttype en de diensten waarin u geïnteresseerd bent', 'Projectlocatie, ongeveer oppervlak, budgetklasse en planning', 'Uw naam en e-mailadres, en uw telefoonnummer als u dat opgeeft', 'Het bericht dat u schrijft en de toestemming die u aanvinkt', 'Een eenrichtings-hash van uw IP-adres (niet het adres zelf), uitsluitend gebruikt om misbruik te beperken. Het wordt niet gebruikt om u te identificeren.'] },
      { h: '3. Wat wij niet verzamelen', p: ['Wij gebruiken geen cookies, trackingpixels, analytics, advertentietools, ingesloten kaarten of social-mediawidgets. Lettertypen, afbeeldingen en video’s komen uitsluitend van deze site, zodat uw browser bij een bezoek geen verzoeken naar andere bedrijven doet. De contactknoppen voor WhatsApp of e-mail openen die diensten pas wanneer u erop klikt; daarna geldt hun eigen beleid.'] },
      { h: '4. Hoe wij uw gegevens gebruiken', p: ['Wij gebruiken uw gegevens uitsluitend om:'], ul: ['Uw aanvraag te beantwoorden', 'U te adviseren over onze diensten en een mogelijk project te bespreken', 'De aanvraag vast te leggen zodat er geen verloren gaat'] },
      { h: '5. Grondslag', p: ['Wij verwerken uw gegevens op basis van uw toestemming (artikel 6, lid 1, onder a AVG), die u geeft door het toestemmingsvakje aan te vinken en het formulier te versturen. U kunt uw toestemming op elk moment intrekken door contact met ons op te nemen.'] },
      { h: '6. Hoe het formulier werkt en waar gegevens worden bewaard', p: ['Wanneer u op verzenden drukt, wordt uw aanvraag via een versleutelde verbinding naar onze webserver gestuurd. De server doet twee dingen: hij e-mailt de aanvraag naar de mailbox van de studio en voegt haar toe aan een afgeschermd aanvraaglogboek op dezelfde webserver, zodat er geen aanvraag verloren gaat als een e-mail niet aankomt. Het logboek is niet via het web toegankelijk.'] },
      { h: '7. Bewaartermijn', p: ['Komt er geen zakelijke relatie tot stand, dan verwijderen wij uw aanvraag, uit het logboek en uit de mailbox, binnen 12 maanden na ontvangst. Gaan we samenwerken, dan bewaren wij de gegevens voor de duur van de relatie en een daaropvolgende wettelijke bewaartermijn. Anti-misbruikgegevens (gehasht IP-adres en tijdstippen) worden automatisch binnen een uur verwijderd.'] },
      { h: '8. Delen', p: ['Wij verkopen, verhandelen of delen uw persoonsgegevens niet. Onze webhostingpartij en onze e-mailprovider verwerken gegevens namens ons als verwerkers, uitsluitend om de website en de e-mail te leveren. Uw gegevens worden voor geen enkel ander doel gebruikt.'] },
      { h: '9. Beveiliging', p: ['Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen ongeautoriseerde toegang, wijziging, openbaarmaking of vernietiging, waaronder versleuteld transport (HTTPS), afgeschermde opslag en spambescherming die niet op tracking berust.'] },
      { h: '10. Uw rechten', p: ['Op grond van de AVG heeft u het recht op:'], ul: ['Inzage: een kopie van uw persoonsgegevens ontvangen', 'Rectificatie: onjuiste gegevens laten corrigeren', 'Verwijdering: uw gegevens laten wissen', 'Beperking: het gebruik van uw gegevens laten beperken', 'Overdraagbaarheid: uw gegevens in een gestructureerd formaat ontvangen', 'Bezwaar tegen bepaalde verwerkingen', 'Toestemming op elk moment intrekken'] },
      { p: ['Om een van deze rechten uit te oefenen, mailt u naar klucas.lucas@gmail.com.'] },
      { h: '11. Klachten', p: ['Als u vindt dat wij niet zorgvuldig met uw gegevens zijn omgegaan, kunt u een klacht indienen bij de Autoriteit Persoonsgegevens, Bezuidenhoutseweg 30, 2594 AV Den Haag, autoriteitpersoonsgegevens.nl.'] },
      { h: '12. Wijzigingen', p: ['Wij kunnen dit beleid van tijd tot tijd aanpassen. Wijzigingen worden op deze pagina geplaatst met een nieuwe herzieningsdatum.'] },
    ],
    ctaTitle: 'Vragen over uw privacy?', ctaText: 'Neem contact met ons op, dan antwoorden wij persoonlijk.',
  },
};

export const legal: Record<Lang, { eyebrow: string; h1: string; lead: string; companyTitle: string; company: [string, string][]; termsTitle: string; terms: [string, string][]; webTitle: string; web: [string, string][]; relatedTitle: string; ctaTitle: string; ctaText: string }> = {
  en: {
    eyebrow: 'Legal notice', h1: 'Company details and terms', lead: 'Imprint, general terms and website terms of CuttingEdge.',
    companyTitle: 'Company information',
    company: [['Trade name', 'CuttingEdge, Interior Design & Build'], ['Address', 'Ookmeerweg 101, 1068AP Amsterdam, The Netherlands'], ['KvK (Chamber of Commerce)', '34153096'], ['BTW (VAT)', 'NL810574163B01'], ['Email', 'klucas.lucas@gmail.com'], ['Phone', '+31 6 47 63 97 02']],
    termsTitle: 'General terms',
    terms: [
      ['1. Scope', 'These terms apply to all services provided by CuttingEdge, including interior design consultation, technical drawings and turn-key build services.'],
      ['2. Quotations & agreements', 'All quotations are valid for 30 days unless otherwise specified. Agreements become binding upon written confirmation or signed contract.'],
      ['3. Intellectual property', 'All designs, drawings, concepts and creative work produced by CuttingEdge remain our intellectual property until full payment is received. Upon payment, rights transfer as specified in the individual project agreement.'],
      ['4. Payment terms', 'Standard payment terms are 30 days from invoice date. Project-specific payment schedules are agreed in individual contracts.'],
      ['5. Liability', 'CuttingEdge maintains professional liability insurance. Our liability is limited to direct damages and shall not exceed the project value. We are not liable for indirect or consequential damages.'],
      ['6. Force majeure', 'Neither party is liable for delays or failures caused by circumstances beyond reasonable control, including natural disasters, pandemics or government actions.'],
      ['7. Dispute resolution', 'Any disputes arising from our services are governed by Dutch law and resolved by the courts of Amsterdam.'],
    ],
    webTitle: 'Website terms',
    web: [
      ['Copyright', 'All content on this website, including images, text and designs, is the property of CuttingEdge and protected by copyright law. Reproduction without written permission is prohibited.'],
      ['Photography credits', 'Project photography is owned by CuttingEdge or used with the express permission of our clients. Some images may not be reproduced without additional permission. Photography of Restaurant Looks: Michael Broekmeulen.'],
      ['Disclaimer', 'While we strive for accuracy, the information on this website is provided “as is” without warranties. Projects shown may differ from final deliverables depending on client requirements. Some background videos are computer-generated visualisations.'],
    ],
    relatedTitle: 'Related policy', ctaTitle: 'Questions about our terms?', ctaText: 'Get in touch.',
  },
  nl: {
    eyebrow: 'Juridische informatie', h1: 'Bedrijfsgegevens en voorwaarden', lead: 'Colofon, algemene voorwaarden en websitevoorwaarden van CuttingEdge.',
    companyTitle: 'Bedrijfsgegevens',
    company: [['Handelsnaam', 'CuttingEdge, Interior Design & Build'], ['Adres', 'Ookmeerweg 101, 1068AP Amsterdam, Nederland'], ['KvK (Kamer van Koophandel)', '34153096'], ['BTW', 'NL810574163B01'], ['E-mail', 'klucas.lucas@gmail.com'], ['Telefoon', '+31 6 47 63 97 02']],
    termsTitle: 'Algemene voorwaarden',
    terms: [
      ['1. Toepasselijkheid', 'Deze voorwaarden zijn van toepassing op alle diensten van CuttingEdge, waaronder interieurontwerpadvies, technische tekeningen en turn-key bouwdiensten.'],
      ['2. Offertes & overeenkomsten', 'Alle offertes zijn 30 dagen geldig, tenzij anders vermeld. Overeenkomsten zijn bindend na schriftelijke bevestiging of ondertekening van een contract.'],
      ['3. Intellectueel eigendom', 'Alle ontwerpen, tekeningen, concepten en creatieve werken van CuttingEdge blijven ons intellectueel eigendom tot volledige betaling is ontvangen. Na betaling gaan de rechten over zoals bepaald in de afzonderlijke projectovereenkomst.'],
      ['4. Betalingsvoorwaarden', 'De standaard betalingstermijn is 30 dagen na factuurdatum. Projectspecifieke betalingsschema’s worden in afzonderlijke contracten overeengekomen.'],
      ['5. Aansprakelijkheid', 'CuttingEdge heeft een beroepsaansprakelijkheidsverzekering. Onze aansprakelijkheid is beperkt tot directe schade en bedraagt maximaal de projectwaarde. Wij zijn niet aansprakelijk voor indirecte schade of gevolgschade.'],
      ['6. Overmacht', 'Geen van beide partijen is aansprakelijk voor vertraging of tekortkoming door omstandigheden buiten redelijke controle, waaronder natuurrampen, pandemieën of overheidsmaatregelen.'],
      ['7. Geschillen', 'Op geschillen die voortvloeien uit onze diensten is Nederlands recht van toepassing; zij worden beslecht door de rechtbank van Amsterdam.'],
    ],
    webTitle: 'Websitevoorwaarden',
    web: [
      ['Auteursrecht', 'Alle inhoud van deze website, waaronder afbeeldingen, teksten en ontwerpen, is eigendom van CuttingEdge en beschermd door het auteursrecht. Verveelvoudiging zonder schriftelijke toestemming is verboden.'],
      ['Fotografie', 'Projectfotografie is eigendom van CuttingEdge of wordt gebruikt met uitdrukkelijke toestemming van onze opdrachtgevers. Sommige afbeeldingen mogen niet zonder aanvullende toestemming worden verveelvoudigd. Fotografie van Restaurant Looks: Michael Broekmeulen.'],
      ['Disclaimer', 'Hoewel wij naar nauwkeurigheid streven, wordt de informatie op deze website geboden “zoals zij is”, zonder garanties. Getoonde projecten kunnen afwijken van de uiteindelijke oplevering, afhankelijk van de wensen van de opdrachtgever. Sommige achtergrondvideo’s zijn computergegenereerde visualisaties.'],
    ],
    relatedTitle: 'Gerelateerd beleid', ctaTitle: 'Vragen over onze voorwaarden?', ctaText: 'Neem contact op.',
  },
};

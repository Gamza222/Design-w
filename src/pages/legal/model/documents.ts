import { ROUTES, type LegalDetails, type Locale } from '@shared/config';

export type LegalDocumentId = 'privacy' | 'offer' | 'requisites' | 'consent';

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalDocument {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

export const LEGAL_ROUTE_IDS: Record<string, LegalDocumentId> = {
  [ROUTES.privacy]: 'privacy',
  [ROUTES.offer]: 'offer',
  [ROUTES.requisites]: 'requisites',
  [ROUTES.consent]: 'consent',
};

const ru: Record<LegalDocumentId, LegalDocument> = {
  privacy: {
    title: 'Политика конфиденциальности',
    description: 'Правила обработки и защиты персональных данных пользователей сайта TheDesignNow.',
    updated: 'Редакция от 25 августа 2026 года',
    sections: [
      {
        title: '1. Общие положения',
        paragraphs: [
          'Политика применяется к данным, которые пользователь передаёт через формы сайта, по электронной почте или в мессенджерах TheDesignNow.',
          'Оператор обрабатывает данные только для связи с пользователем, подготовки расчёта, заключения и исполнения договора, а также выполнения требований закона.',
        ],
      },
      {
        title: '2. Какие данные обрабатываются',
        items: [
          'Имя, номер телефона и адрес электронной почты.',
          'Сведения об объекте, площадь, комментарий и материалы, которые пользователь передал для расчёта проекта.',
          'Технические данные браузера и устройства, если они собираются системой аналитики или хостингом.',
        ],
      },
      {
        title: '3. Цели и основания обработки',
        items: [
          'Ответ на обращение и подготовка индивидуального предложения.',
          'Заключение, исполнение и сопровождение договора на дизайн-услуги.',
          'Получение согласия пользователя и выполнение обязанностей, установленных законом.',
        ],
      },
      {
        title: '4. Хранение и передача',
        paragraphs: [
          'Данные хранятся не дольше, чем этого требуют цели обработки и применимое законодательство. Доступ получают только исполнитель и привлечённые сервисы, необходимые для работы сайта, связи, оплаты и документооборота.',
          'Передача данных в другую страну допускается только при наличии законного основания и необходимых мер защиты.',
        ],
      },
      {
        title: '5. Права пользователя',
        paragraphs: [
          'Пользователь может запросить сведения об обработке, исправление или удаление данных, ограничить обработку либо отозвать согласие. Запрос направляется на адрес электронной почты, указанный на странице контактов.',
        ],
      },
    ],
  },
  offer: {
    title: 'Договор публичной оферты',
    description: 'Условия заказа, оплаты и оказания услуг по разработке дизайн-проекта.',
    updated: 'Редакция от 25 августа 2026 года',
    sections: [
      {
        title: '1. Общие положения',
        paragraphs: [
          'Этот документ определяет общие условия оказания дизайн-услуг. Исполнителем является лицо, чьи полные реквизиты указаны в счёте или индивидуальном договоре, направленном заказчику до оплаты.',
          'Оплата счёта или согласованного этапа означает принятие условий оферты в части, которая не изменена индивидуальным договором, техническим заданием или счётом.',
        ],
      },
      {
        title: '2. Предмет договора',
        paragraphs: [
          'Исполнитель разрабатывает дизайн-проект или оказывает отдельные услуги в объёме, согласованном в брифе, техническом задании, переписке, счёте или индивидуальном договоре. Заказчик предоставляет исходные данные, согласовывает этапы и оплачивает услуги.',
        ],
      },
      {
        title: '3. Стоимость и валюты',
        items: [
          'Цены на сайте являются предварительными. Итоговая стоимость фиксируется в счёте или индивидуальном договоре до оплаты.',
          'Для заказчиков из России расчёт может производиться в российских рублях, RUB. Для заказчиков из Беларуси расчёт может производиться в белорусских рублях, BYN.',
          'Если стороны согласовали другую валюту или порядок пересчёта, приоритет имеют условия счёта или индивидуального договора.',
          'После выставления счёта его сумма не меняется из-за колебаний курса в течение срока действия счёта.',
        ],
      },
      {
        title: '4. Способы и момент оплаты',
        items: [
          'Банковская карта платёжной системы МИР.',
          'Банковская карта платёжной системы БЕЛКАРТ, если этот способ доступен у подключённого платёжного партнёра.',
          'Безналичный перевод на расчётный счёт в RUB или BYN по реквизитам в счёте.',
          'Обязательство по оплате считается исполненным после зачисления средств на счёт исполнителя. Комиссии банка плательщика оплачивает заказчик, если стороны письменно не согласовали иное.',
        ],
      },
      {
        title: '5. Порядок работы',
        paragraphs: [
          'Срок начинается после поступления согласованной предоплаты и получения всех исходных данных. Срок приостанавливается на время ожидания материалов, ответов или согласования от заказчика.',
          'Количество вариантов, правок, состав проекта, формат передачи и этапы согласования определяются выбранным пакетом и техническим заданием.',
        ],
      },
      {
        title: '6. Приёмка результата',
        paragraphs: [
          'Результат передаётся в электронном виде. Заказчик проверяет этап в согласованный срок и направляет единый список замечаний. При отсутствии замечаний в установленный срок этап считается принятым, если иной порядок не указан в индивидуальном договоре.',
        ],
      },
      {
        title: '7. Отмена и возврат',
        paragraphs: [
          'Заказчик вправе отказаться от услуг, оплатив фактически выполненную работу и подтверждённые расходы исполнителя. Неотработанная часть аванса возвращается тем же способом, которым была получена, если банк или закон не требуют другого порядка.',
        ],
      },
      {
        title: '8. Ответственность и споры',
        paragraphs: [
          'Стороны отвечают за нарушение обязательств по применимому законодательству и условиям договора. До обращения в суд стороны стараются урегулировать спор письменно. Право и подсудность уточняются в индивидуальном договоре с учётом страны заказчика.',
        ],
      },
      {
        title: '9. Персональные данные',
        paragraphs: [
          'Обработка персональных данных выполняется по Политике конфиденциальности и согласию пользователя, опубликованным на сайте.',
        ],
      },
    ],
  },
  requisites: {
    title: 'Реквизиты исполнителя',
    description: 'Данные для договора, счёта и безналичной оплаты услуг.',
    updated: 'Актуальные реквизиты направляются вместе со счётом',
    sections: [
      {
        title: 'Как получить реквизиты',
        paragraphs: [
          'Полное наименование исполнителя, регистрационные и банковские реквизиты указываются в счёте и индивидуальном договоре до оплаты. Это позволяет использовать правильный счёт для выбранной валюты, RUB или BYN.',
          'Запросить реквизиты можно по электронной почте или через форму на странице контактов.',
        ],
      },
    ],
  },
  consent: {
    title: 'Согласие на обработку персональных данных',
    description: 'Условия обработки данных, переданных через формы и каналы связи TheDesignNow.',
    updated: 'Редакция от 25 августа 2026 года',
    sections: [
      {
        title: 'Содержание согласия',
        paragraphs: [
          'Отправляя форму или передавая данные по указанным на сайте каналам, пользователь свободно и осознанно соглашается на обработку имени, телефона, электронной почты, сведений об объекте и текста обращения.',
        ],
      },
      {
        title: 'Разрешённые действия',
        paragraphs: [
          'Согласие распространяется на сбор, запись, систематизацию, хранение, уточнение, использование, передачу сервисам связи и документооборота, блокирование и удаление данных в объёме, необходимом для ответа и исполнения договора.',
        ],
      },
      {
        title: 'Срок и отзыв',
        paragraphs: [
          'Согласие действует до достижения целей обработки или до его отзыва. Для отзыва пользователь направляет запрос на электронную почту, указанную на странице контактов. Обработка, необходимая по закону или для исполнения действующего договора, может продолжаться после отзыва.',
        ],
      },
    ],
  },
};

const en: Record<LegalDocumentId, LegalDocument> = {
  privacy: {
    title: 'Privacy policy',
    description:
      'How TheDesignNow processes and protects personal data submitted through this website.',
    updated: 'Effective 25 August 2026',
    sections: [
      {
        title: '1. Scope',
        paragraphs: [
          'This policy applies to data submitted through website forms, email and TheDesignNow messaging channels. Data is used to answer enquiries, prepare estimates, enter into and perform contracts, and comply with applicable law.',
        ],
      },
      {
        title: '2. Data processed',
        items: [
          'Name, telephone number and email address.',
          'Project details, area, comments and files supplied for an estimate.',
          'Browser and device data collected by hosting or analytics services, when enabled.',
        ],
      },
      {
        title: '3. Storage and sharing',
        paragraphs: [
          'Data is retained only as long as required for the stated purposes and by applicable law. Access is limited to the contractor and services required for hosting, communication, payment and document management.',
        ],
      },
      {
        title: '4. Your rights',
        paragraphs: [
          'You may request access, correction, deletion or restriction of your data, or withdraw consent, by writing to the email address shown on the contact page.',
        ],
      },
    ],
  },
  offer: {
    title: 'Public offer agreement',
    description: 'Terms for ordering, paying for and receiving interior design services.',
    updated: 'Effective 25 August 2026',
    sections: [
      {
        title: '1. General terms',
        paragraphs: [
          'This document sets out the general terms for design services. The contractor is the person or entity whose full details appear in the invoice or individual agreement supplied before payment.',
          'Payment of an invoice or agreed project stage constitutes acceptance of these terms unless an individual agreement, brief or invoice expressly provides otherwise.',
        ],
      },
      {
        title: '2. Services',
        paragraphs: [
          'The contractor supplies the design project or separate services described in the agreed brief, scope, correspondence, invoice or individual agreement. The client provides source materials, approves stages and pays the agreed fees.',
        ],
      },
      {
        title: '3. Prices and currencies',
        items: [
          'Website prices are preliminary. The final amount is fixed in the invoice or individual agreement before payment.',
          'Clients in Russia may pay in Russian rubles, RUB. Clients in Belarus may pay in Belarusian rubles, BYN.',
          'A valid invoice amount does not change due to exchange-rate movements during the invoice payment period.',
        ],
      },
      {
        title: '4. Payment methods',
        items: [
          'MIR payment card.',
          'BELKART payment card when supported by the connected payment partner.',
          'Bank transfer to the RUB or BYN settlement account stated in the invoice.',
          'Payment is complete when funds reach the contractor account. The client bears fees charged by the client bank unless agreed otherwise in writing.',
        ],
      },
      {
        title: '5. Delivery and approval',
        paragraphs: [
          'The delivery period begins after the agreed advance payment and receipt of all source materials. Time spent awaiting client materials, answers or approval is excluded.',
          'Deliverables are supplied electronically. The number of options, revisions and stages is defined by the selected package and agreed scope.',
        ],
      },
      {
        title: '6. Cancellation and refunds',
        paragraphs: [
          'The client may cancel the services and must pay for work already completed and documented expenses. Any unused advance is returned by the original payment method unless the bank or applicable law requires another method.',
        ],
      },
      {
        title: '7. Data and disputes',
        paragraphs: [
          'Personal data is processed under the privacy policy and consent published on this website. The parties first seek to resolve disputes in writing. Governing law and jurisdiction are specified in the individual agreement with regard to the client country.',
        ],
      },
    ],
  },
  requisites: {
    title: 'Contractor details',
    description: 'Information used for agreements, invoices and bank payments.',
    updated: 'Current details are supplied with each invoice',
    sections: [
      {
        title: 'How to obtain the details',
        paragraphs: [
          'The contractor legal, registration and bank details are stated in the invoice and individual agreement before payment. This ensures that the correct RUB or BYN settlement account is used.',
          'You can request the details by email or through the contact form.',
        ],
      },
    ],
  },
  consent: {
    title: 'Consent to personal data processing',
    description:
      'Terms for processing data submitted through TheDesignNow forms and communication channels.',
    updated: 'Effective 25 August 2026',
    sections: [
      {
        title: 'Consent',
        paragraphs: [
          'By submitting a form or contacting TheDesignNow through a listed channel, you freely consent to processing your name, telephone number, email address, project details and message.',
        ],
      },
      {
        title: 'Permitted processing',
        paragraphs: [
          'Consent covers collection, recording, organisation, storage, correction, use, transfer to required communication and document services, restriction and deletion for responding to the enquiry and performing a contract.',
        ],
      },
      {
        title: 'Term and withdrawal',
        paragraphs: [
          'Consent remains valid until its purpose is fulfilled or it is withdrawn by email. Processing required by law or for an active contract may continue after withdrawal.',
        ],
      },
    ],
  },
};

const be: Record<LegalDocumentId, LegalDocument> = {
  privacy: {
    title: 'Палітыка прыватнасці',
    description:
      'Правілы апрацоўкі і абароны персанальных даных карыстальнікаў сайта TheDesignNow.',
    updated: 'Рэдакцыя ад 25 жніўня 2026 года',
    sections: [
      {
        title: '1. Агульныя палажэнні',
        paragraphs: [
          'Палітыка дзейнічае для даных, якія карыстальнік перадае праз формы сайта, электронную пошту або месенджары TheDesignNow.',
          'Аператар апрацоўвае даныя толькі для сувязі з карыстальнікам, падрыхтоўкі разліку, заключэння і выканання дагавора, а таксама выканання патрабаванняў закона.',
        ],
      },
      {
        title: '2. Якія даныя апрацоўваюцца',
        items: [
          'Імя, нумар тэлефона і адрас электроннай пошты.',
          'Звесткі аб аб’екце, плошча, каментарый і матэрыялы, перададзеныя для разліку праекта.',
          'Тэхнічныя даныя браўзера і прылады, калі іх збірае сістэма аналітыкі або хостынг.',
        ],
      },
      {
        title: '3. Захоўванне і перадача',
        paragraphs: [
          'Даныя захоўваюцца не даўжэй, чым патрабуюць мэты апрацоўкі і заканадаўства. Доступ маюць толькі выканаўца і сэрвісы, неабходныя для працы сайта, сувязі, аплаты і дакументаабароту.',
        ],
      },
      {
        title: '4. Правы карыстальніка',
        paragraphs: [
          'Карыстальнік можа запытаць звесткі аб апрацоўцы, выпраўленне або выдаленне даных, абмежаваць апрацоўку ці адклікаць згоду праз электронную пошту, пазначаную на старонцы кантактаў.',
        ],
      },
    ],
  },
  offer: {
    title: 'Дагавор публічнай аферты',
    description: 'Умовы заказу, аплаты і аказання паслуг па распрацоўцы дызайн-праекта.',
    updated: 'Рэдакцыя ад 25 жніўня 2026 года',
    sections: [
      {
        title: '1. Агульныя палажэнні',
        paragraphs: [
          'Гэты дакумент вызначае агульныя ўмовы аказання дызайн-паслуг. Выканаўцам з’яўляецца асоба, поўныя рэквізіты якой пазначаны ў рахунку або індывідуальным дагаворы, накіраваным заказчыку да аплаты.',
          'Аплата рахунку або ўзгодненага этапу азначае прыняцце ўмоў аферты ў частцы, якая не зменена індывідуальным дагаворам, тэхнічным заданнем або рахункам.',
        ],
      },
      {
        title: '2. Прадмет дагавора',
        paragraphs: [
          'Выканаўца распрацоўвае дызайн-праект або аказвае асобныя паслугі ў аб’ёме, узгодненым у брыфе, тэхнічным заданні, перапісцы, рахунку або індывідуальным дагаворы. Заказчык перадае зыходныя даныя, узгадняе этапы і аплачвае паслугі.',
        ],
      },
      {
        title: '3. Кошт і валюты',
        items: [
          'Цэны на сайце папярэднія. Канчатковы кошт фіксуецца ў рахунку або індывідуальным дагаворы да аплаты.',
          'Для заказчыкаў з Расіі разлік можа праводзіцца ў расійскіх рублях, RUB. Для заказчыкаў з Беларусі разлік можа праводзіцца ў беларускіх рублях, BYN.',
          'Пасля выстаўлення рахунку яго сума не змяняецца праз ваганні курсу на працягу тэрміну дзеяння рахунку.',
        ],
      },
      {
        title: '4. Спосабы аплаты',
        items: [
          'Банкаўская картка плацежнай сістэмы МИР.',
          'Банкаўская картка плацежнай сістэмы БЕЛКАРТ, калі гэты спосаб падтрымлівае падключаны плацежны партнёр.',
          'Безнаяўны перавод на разліковы рахунак у RUB або BYN па рэквізітах у рахунку.',
          'Аплата лічыцца выкананай пасля залічэння сродкаў на рахунак выканаўцы. Камісію банка плацельшчыка аплачвае заказчык, калі бакі пісьмова не ўзгаднілі іншае.',
        ],
      },
      {
        title: '5. Парадак працы',
        paragraphs: [
          'Тэрмін пачынаецца пасля паступлення ўзгодненай перадаплаты і атрымання ўсіх зыходных даных. Тэрмін прыпыняецца на час чакання матэрыялаў, адказаў або ўзгаднення ад заказчыка.',
          'Колькасць варыянтаў, правак, склад праекта, фармат перадачы і этапы ўзгаднення вызначаюцца выбраным пакетам і тэхнічным заданнем.',
        ],
      },
      {
        title: '6. Адмена і вяртанне',
        paragraphs: [
          'Заказчык можа адмовіцца ад паслуг, аплаціўшы фактычна выкананую працу і пацверджаныя выдаткі выканаўцы. Нявыкарыстаная частка авансу вяртаецца тым жа спосабам, якім была атрымана, калі банк або закон не патрабуюць іншага парадку.',
        ],
      },
      {
        title: '7. Даныя і спрэчкі',
        paragraphs: [
          'Персанальныя даныя апрацоўваюцца паводле Палітыкі прыватнасці і згоды карыстальніка. Да звароту ў суд бакі імкнуцца ўрэгуляваць спрэчку пісьмова. Права і падсуднасць удакладняюцца ў індывідуальным дагаворы з улікам краіны заказчыка.',
        ],
      },
    ],
  },
  requisites: {
    title: 'Рэквізіты выканаўцы',
    description: 'Даныя для дагавора, рахунку і безнаяўнай аплаты паслуг.',
    updated: 'Актуальныя рэквізіты накіроўваюцца разам з рахункам',
    sections: [
      {
        title: 'Як атрымаць рэквізіты',
        paragraphs: [
          'Поўная назва выканаўцы, рэгістрацыйныя і банкаўскія рэквізіты пазначаюцца ў рахунку і індывідуальным дагаворы да аплаты. Гэта дазваляе выкарыстоўваць правільны разліковы рахунак для RUB або BYN.',
          'Запытаць рэквізіты можна па электроннай пошце або праз форму на старонцы кантактаў.',
        ],
      },
    ],
  },
  consent: {
    title: 'Згода на апрацоўку персанальных даных',
    description: 'Умовы апрацоўкі даных, перададзеных праз формы і каналы сувязі TheDesignNow.',
    updated: 'Рэдакцыя ад 25 жніўня 2026 года',
    sections: [
      {
        title: 'Змест згоды',
        paragraphs: [
          'Адпраўляючы форму або перадаючы даныя праз пазначаныя на сайце каналы, карыстальнік свабодна і свядома згаджаецца на апрацоўку імя, тэлефона, электроннай пошты, звестак аб аб’екце і тэксту звароту.',
        ],
      },
      {
        title: 'Дазволеныя дзеянні',
        paragraphs: [
          'Згода ахоплівае збор, запіс, сістэматызацыю, захоўванне, удакладненне, выкарыстанне, перадачу неабходным сэрвісам сувязі і дакументаабароту, блакіраванне і выдаленне даных для адказу і выканання дагавора.',
        ],
      },
      {
        title: 'Тэрмін і адкліканне',
        paragraphs: [
          'Згода дзейнічае да дасягнення мэт апрацоўкі або да яе адклікання. Для адклікання карыстальнік накіроўвае запыт на электронную пошту са старонкі кантактаў. Апрацоўка, неабходная паводле закона або для выканання дзейнага дагавора, можа працягвацца пасля адклікання.',
        ],
      },
    ],
  },
};

export const LEGAL_DOCUMENTS: Record<Locale, Record<LegalDocumentId, LegalDocument>> = {
  ru,
  en,
  be,
};

export const LEGAL_DETAIL_LABELS: Record<Locale, Record<keyof LegalDetails, string>> = {
  ru: {
    legalName: 'Исполнитель',
    taxId: 'ИНН',
    registrationId: 'ОГРН / ОГРНИП',
    legalAddress: 'Юридический адрес',
    bankName: 'Банк',
    bankAccountRub: 'Расчётный счёт RUB',
    bankAccountByn: 'Расчётный счёт BYN',
    bankId: 'БИК / код банка',
    correspondentAccount: 'Корреспондентский счёт',
  },
  en: {
    legalName: 'Contractor',
    taxId: 'Tax ID',
    registrationId: 'Registration ID',
    legalAddress: 'Registered address',
    bankName: 'Bank',
    bankAccountRub: 'RUB settlement account',
    bankAccountByn: 'BYN settlement account',
    bankId: 'Bank ID',
    correspondentAccount: 'Correspondent account',
  },
  be: {
    legalName: 'Выканаўца',
    taxId: 'Падатковы нумар',
    registrationId: 'Рэгістрацыйны нумар',
    legalAddress: 'Юрыдычны адрас',
    bankName: 'Банк',
    bankAccountRub: 'Разліковы рахунак RUB',
    bankAccountByn: 'Разліковы рахунак BYN',
    bankId: 'Код банка',
    correspondentAccount: 'Карэспандэнцкі рахунак',
  },
};

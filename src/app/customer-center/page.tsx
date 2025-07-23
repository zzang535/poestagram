import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('customerCenter');
  
  return {
    title: `${t('title')} - poestagram`,
    description: 'Get support and find answers to frequently asked questions about poestagram.',
    keywords: ['poestagram', 'customer support', 'help', 'FAQ', 'contact'],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CustomerCenterPage() {
  const t = await getTranslations('customerCenter');

  return (
    <div className="min-h-screen bg-black text-white pt-[64px]">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* 연락처 정보 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">{t('contact.title')}</h2>
          <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
            <div className="space-y-3">
              <p className="text-gray-300">{t('contact.company')}</p>
              <p className="text-gray-300">
                <a 
                  href="mailto:poestagramer@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t('contact.email')}
                </a>
              </p>
              <p className="text-gray-300">
                <a 
                  href="tel:010-2849-0490" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t('contact.phone')}
                </a>
              </p>
              <p className="text-gray-300">{t('contact.hours')}</p>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">{t('faq.title')}</h2>
          <div className="space-y-6">
            {/* FAQ 항목들 */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">{t('faq.q1.question')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('faq.q1.answer')}</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">{t('faq.q2.question')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('faq.q2.answer')}</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">{t('faq.q3.question')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('faq.q3.answer')}</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">{t('faq.q4.question')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('faq.q4.answer')}</p>
            </div>

            {/* <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">{t('faq.q5.question')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('faq.q5.answer')}</p>
            </div> */}
          </div>
        </section>

        {/* 추가 지원 섹션 */}
        <section className="mb-8">
          <div className="bg-zinc-900 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">{t('support.title')}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{t('support.description')}</p>
            <a
              href={`mailto:poestagramer@gmail.com?subject=${encodeURIComponent(t('support.emailSubject'))}`}
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {t('contact.email').replace('이메일: ', '').replace('Email: ', '')}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

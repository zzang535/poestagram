import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose, onAgree }: TermsOfServiceModalProps) {
  const t = useTranslations('policy.termsOfService');
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('title')}
      footer={
        <div className="bg-zinc-950 border-t border-zinc-900 flex justify-center items-center h-full">
          <div className="flex items-center gap-4 px-4 w-full max-w-[768px]">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              {t('close')}
            </Button>
            {onAgree && (
              <Button
                onClick={() => {
                  onAgree();
                  onClose();
                }}
                variant="primary"
                className="flex-1"
              >
                {t('agree')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* 내용 */}
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section1.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section1.content')}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section2.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section2.content')}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section3.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section3.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section3.items.0')}</li>
            <li>{t('section3.items.1')}</li>
            <li>{t('section3.items.2')}</li>
            <li>{t('section3.items.3')}</li>
            <li>{t('section3.items.4')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section4.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section4.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section4.items.0')}</li>
            <li>{t('section4.items.1')}</li>
            <li>{t('section4.items.2')}</li>
            <li>{t('section4.items.3')}</li>
            <li>{t('section4.items.4')}</li>
            <li>{t('section4.items.5')}</li>
            <li>{t('section4.items.6')}</li>
            <li>{t('section4.items.7')}</li>
            <li>{t('section4.items.8')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section5.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section5.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section5.items.0')}</li>
            <li>{t('section5.items.1')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section6.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section6.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section6.items.0')}</li>
            <li>{t('section6.items.1')}</li>
            <li>{t('section6.items.2')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section7.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section7.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section7.items.0')}</li>
            <li>{t('section7.items.1')}</li>
            <li>{t('section7.items.2')}</li>
            <li>{t('section7.items.3')}</li>
            <li>{t('section7.items.4')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section8.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section8.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section8.items.0')}</li>
            <li>{t('section8.items.1')}</li>
            <li>{t('section8.items.2')}</li>
            <li>{t('section8.items.3')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section9.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section9.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section9.items.0')}</li>
            <li>{t('section9.items.1')}</li>
            <li>{t('section9.items.2')}</li>
            <li>{t('section9.items.3')}</li>
            <li>{t('section9.items.4')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section10.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section10.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section10.items.0')}</li>
            <li>{t('section10.items.1')}</li>
            <li>{t('section10.items.2')}</li>
            <li>{t('section10.items.3')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section11.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section11.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section11.items.0')}</li>
            <li>{t('section11.items.1')}</li>
            <li>{t('section11.items.2')}</li>
            <li>{t('section11.items.3')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t('section12.title')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('section12.content')}
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>{t('section12.items.0')}</li>
            <li>{t('section12.items.1')}</li>
            <li>{t('section12.items.2')}</li>
            <li>{t('section12.items.3')}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 
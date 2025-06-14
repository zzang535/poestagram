import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faClock } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: '서비스 점검 중 - poestagram',
  description: 'poestagram 서비스가 현재 점검 중입니다. 잠시 후 다시 이용해주세요.',
  robots: {
    index: false,
    follow: false,
  },
};

export function MaintenanceContent() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          
          <h1 className="text-2xl font-bold mb-4">
            서비스 점검 중
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            poestagram 서비스가 현재 점검 중입니다.<br />
            더 나은 서비스 제공을 위해 시스템을 업데이트하고 있습니다.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <span className="text-sm font-medium text-gray-300">예상 점검 시간 (한국시간)</span>
          </div>
          <div className="text-xl font-bold text-orange-500">
            6월 14일 12:00 ~ 14:00
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-2">
          <p>
            점검이 완료되면 자동으로 서비스가 재개됩니다.
          </p>
          <p>
            이용에 불편을 드려 죄송합니다.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>poestagram</span>
            {/* <span>•</span>
            <span>POE 커뮤니티</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  return <MaintenanceContent />;
} 
/**
 * 재시도 로직이 포함된 비동기 함수 실행기
 * 
 * @param fn 실행할 비동기 함수
 * @param retries 재시도 횟수 (기본값: 2)
 * @param delayMs 재시도 간 지연 시간 (밀리초) (기본값: 1000)
 * @returns 비동기 함수의 결과값
 */
export async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = 2,
    delayMs = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return fetchWithRetry(fn, retries - 1, delayMs);
      }
      throw err;
    }
  }
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function OpenDepositIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step 0 when accessing /open-deposit
    router.replace('/open-deposit/0');
  }, [router]);

  return null;
}
import React, { Suspense } from 'react';
import Table from '@/app/(users)/Admin/Components/Table'
import Search from '@/app/(users)/Student/Components/Search';

// Create a fallback component for loading state
const Loading = () => <div>Loading...</div>;

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="p-10">
        <Suspense fallback={<Loading />}>
          <Search placeholder="Search for a User..." />
        </Suspense>
        <Suspense fallback={<Loading />}>
          {/* <Table /> */}
        </Suspense>
      </div>
    </div>
  );
}
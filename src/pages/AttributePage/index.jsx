import CommonList from '@/components/common/CommonList';
import Layout from '@/components/Layout';
import ListOfCategoryPage from '@/components/ListOfCategoryPage';
import React, { useState } from 'react';

const DemoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const parentObj = {
    addcategory: function () {
      setIsModalOpen(true);
    },
  };
  const handlebtnHit = data => {};
  return (
    <>
      <Layout
        headername={'Category'}
        btnlabel={'Add Category'}
        handleClickEvent={data => handlebtnHit(data)}
      >
        <CommonList />
      </Layout>
    </>
  );
};

export default DemoPage;

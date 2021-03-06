import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from 'Storybook/Input/Input';
import ValidationError from 'Storybook/ValidationError/ValidationError';
import Button, { ButtonVariant } from 'Storybook/Button/Button';
import Container from 'Storybook/Container/Container';
import { checkFileForImgBB } from 'Utils/getCheckFileFunc';
import { RouteNames } from 'Models/Route';
import getErrorValidationMessage from 'Utils/getErrorMessage';
import { useAppDispatch, useAppSelector } from 'Hooks/redux';
import { selectorCategoriesData } from 'Store/categories/categoriesSelectors';
import Select from 'Components/storybook/Select/Select';
import useCreateRequest from 'Hooks/useCreateRequest';
import { selectorBrands } from 'Store/brands/brandsSelectors';
import requestAdvertisementCreate, { AdvertisementReqData, AdvertisementResponse } from 'Packages/api/rest/advertisement/requestAdvertisementCreate';
import { fetchBrands } from 'Store/brands/brandsAsyncActions';
import useIsFirstRender from 'Hooks/useIsFirstRender';

import s from './AdvertisementCreate.module.scss';

interface AdvertisementData {
  categoryId: string,
  brandId: string,
  title: string,
  price: string,
  description: string,
  files: File[],
}

const AdvertisementCreate = () => {
  const isFirstRender = useIsFirstRender();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dataCategories = useAppSelector(selectorCategoriesData);
  const {
    data: dataBrands,
    isLoading: isLoadingBrands,
  } = useAppSelector(selectorBrands);

  const onSucces = () => {
    navigate(RouteNames.ADVERTISEMENT_MY_ADVERTISEMENTS);
  };

  const optionsCategories = useMemo(() => (
    dataCategories.map(({ id, name }) => ({ value: id, mnemonic: name }))
  ), [dataCategories]);

  const optionsBrands = useMemo(() => (
    dataBrands.map(({ id, name }) => ({ value: id, mnemonic: name }))
  ), [dataBrands]);

  const [advertisementData, setAdvertisementData] = useState<AdvertisementData>({
    categoryId: '0',
    brandId: '0',
    title: '',
    price: '',
    description: '',
    files: [],
  });

  const {
    error,
    fetchReq,
    isLoading,
  } = useCreateRequest<AdvertisementResponse, AdvertisementReqData>({
    restReq: (formData) => requestAdvertisementCreate(formData || new FormData()),
    onSucces,
  });

  useEffect(() => {
    if (!isFirstRender) {
      dispatch(fetchBrands({ categoryId: Number(advertisementData.categoryId) }));
      setAdvertisementData((prev) => ({ ...prev, brandId: '0' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertisementData.categoryId, dispatch]);

  const onChangeSelecthandler = (
    value: unknown,
    name: string,
  ) => {
    setAdvertisementData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeInputHandler = ({ target }: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setAdvertisementData((prev) => ({ ...prev, [name]: target.value }));
  };

  const onChangeTextareaHandler = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdvertisementData((prev) => ({ ...prev, description: target.value }));
  };

  const onChangeFileHandler = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    const filesVerify: File[] = [];

    [].forEach.call(files, (file) => {
      if (!checkFileForImgBB(file)) {
        // TODO: ???????????????? ????????????
        // eslint-disable-next-line
        console.log('?????????? ?????????????????? ?????????? ?????????????? ".png", ".jpg", ???? ?????????????????????? ???????????? 32????');
        return;
      }

      filesVerify.push(file);
    });

    setAdvertisementData((prev) => ({ ...prev, files: filesVerify }));
  };

  const onClickButtonHandler = () => {
    const {
      brandId,
      categoryId,
      description,
      price,
      title,
      files,
    } = advertisementData;

    const formData = new FormData();
    formData.append('brandId', brandId);
    formData.append('categoryId', categoryId);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('title', title);

    if (files.length) {
      files.forEach((file) => {
        formData.append('file', file);
      });
    }

    fetchReq(formData);
  };

  const textInBrandsSelect = () => {
    if (isLoadingBrands) {
      return '????????????????';
    }

    if (advertisementData.categoryId === '0') {
      return '???????????????? ?????????????? ??????????????????';
    }

    return '???????????????? ??????????????';
  };

  return (
    <Container className={s.advertisementCreateWrapper}>
      <div className={s.title}>???????????????? ????????????????????</div>
      <div>
        <p>??????????????????</p>
        <Select
          options={optionsCategories}
          onChange={(value) => { onChangeSelecthandler(value, 'categoryId'); }}
        />
        <ValidationError error={getErrorValidationMessage(error, 'categoryId')} />
        <div className={s.br} />
        <p>??????????</p>
        <Select
          options={optionsBrands}
          onChange={(value) => { onChangeSelecthandler(value, 'brandId'); }}
          placeholder={textInBrandsSelect()}
        />
        <ValidationError error={getErrorValidationMessage(error, 'brandId')} />
        <div className={s.br} />
        <p>???????????????? ????????????</p>
        <Input onChange={(e) => onChangeInputHandler(e, 'title')} name="title" value={advertisementData.title} placeholder="?????????????? ???????????????? ????????????" />
        <ValidationError error={getErrorValidationMessage(error, 'title')} />
        <div className={s.br} />
        <p>????????</p>
        <Input name="price" value={advertisementData.price} onChange={(e) => onChangeInputHandler(e, 'price')} placeholder="?????????????? ????????" />
        <ValidationError error={getErrorValidationMessage(error, 'price')} />
        <div className={s.br} />
        <p>????????????????</p>
        <textarea value={advertisementData.description} onChange={onChangeTextareaHandler} />
        <ValidationError error={getErrorValidationMessage(error, 'description')} />
        <div className={s.br} />
        <p>????????????????????</p>
        <input type="file" multiple onChange={onChangeFileHandler} />
        <div className={s.br} />
        <Button
          onClick={onClickButtonHandler}
          isLoading={isLoading}
          variant={ButtonVariant.blue}
        >
          ??????????????
        </Button>
      </div>
    </Container>
  );
};

export default AdvertisementCreate;

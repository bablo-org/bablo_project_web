import useHomeApi from "../../hooks/useHomeApi";
import classes from './UserProfile.module.css';
import { useState } from "react";
import { getDownloadURL, storage, ref } from '../../services/firebase';
import Spinner from "../Spinner/Spinner";

const UserProfile = () => {
    const { putUser, postUserAvatar } = useHomeApi();
    const [imageError, setImageError] = useState();
    const [imageTypeError, setImageTypeError] = useState();
    const [imageSizeError, setImageSizeError] = useState();
    const [isProfileUpdated, setIsProfileUpdate] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [encodedImageName, setEncodedImageName] = useState();
    const [encodedImageCode, setEncodedImageCode] = useState();
    const [name, setName] = useState();
    const [avatar, setAvatar] = useState();


    const changeUserName = (e) => {
        if (e.target.value && e.target.value !== '') {
            setName(e.target.value);
            setIsProfileUpdate(false);
            setError(false);
        }
    }

    const changeUserAvatar = (e) => {
        if (e.target.files[0]) {
            setError(false);
            setIsProfileUpdate(false);
            setImageError(false);
            setImageTypeError(false);
            setImageSizeError(false);
            encodeImageFileAsURL(e);
        }
    }

    const encodeImageFileAsURL = (element) => {
        const file = element.target.files[0];
        const fileSize = element.target.files[0].size;
        const fileType = element.target.files[0].type.split('/')[1];

        if (['jpeg', 'bmp', 'png', 'gif'].includes(fileType) && fileSize < 1024001) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setEncodedImageName(encodeURIComponent(element.target.files[0].name));
                trasformString(reader.result);
            }
        } else {
            setImageError(true);
            if (['jpeg', 'bmp', 'png', 'gif'].includes(fileType)) {
                if (fileSize > 1024001) {
                    setImageSizeError(true);
                }
            } else {
                setImageTypeError(true);
            }
        }
    }

    const trasformString = (string) => {
        const codeValue = string.split("base64,")[1];
        setEncodedImageCode(codeValue);
    }

    const updateUser = async () => {
        try {
            if (encodedImageCode) {
                setLoading(true);
                const response = await postUserAvatar(encodedImageCode, encodedImageName);
                const avatar = await getDownloadURL(ref(storage, response.path));
                setAvatar(avatar);
                await putUser(JSON.stringify({ name, avatar}));
                setIsProfileUpdate(true);
            } else if (name) {
                setLoading(true);
                await putUser(JSON.stringify({ name }));
                setIsProfileUpdate(true);
            }
        } catch (error) {
            throw (error);
        } finally {
            setLoading(false);
        }
    }
    const validateAndSubmit = (e) => {
        e.preventDefault();
        if (!imageError && (name || encodedImageName)) {
            updateUser();
        } else {
            setError(true);
        }
    }

    return (
        <div className={classes.container}>
            <form
                onSubmit={validateAndSubmit}
                className={classes.form}>
                <h1>Изменение данных пользователя</h1>
                <div className={classes.control}>
                    <label>Введите имя пользователя</label>
                    <input type="text" onChange={changeUserName} />
                </div>
                <div className={classes.control}>
                    <label>Выберите файл аватара</label>
                    <input type="file" onChange={changeUserAvatar} />
                    {imageTypeError && (
                        <div style={{ color: '#a70000' }}>
                            Расширение выбранного файла должно быть 'jpeg', 'bmp', 'png' или 'gif'
                        </div>
                    )}
                    {imageSizeError && (
                        <div style={{ color: '#a70000' }}>
                            Размер выбранного файла должен быть не более 1 Mbyte
                        </div>
                    )}
                    {imageError && !imageTypeError && !imageSizeError && (
                        <div style={{ color: '#a70000' }}>
                            Неизвестная ошибка
                        </div>
                    )}
                    {error && !imageError && (
                        <div style={{ color: '#a70000' }}>
                            Введите данные
                        </div>
                    )}
                </div>
                <div className={classes.actions}>
                    {loading ?
                        <Spinner width='100px' height='100px' /> :
                        !isProfileUpdated ?
                            <button className={classes.submit}>Подтвердить</button> : null}
                </div>
                {isProfileUpdated ?
                    <div style={{ color: 'green', fontWeight: 'bold', fontSize: '22px' }}>
                        Внесенные данные успешно изменены
                    </div> : null}
            </form>
        </div>
    )
}

export default UserProfile;
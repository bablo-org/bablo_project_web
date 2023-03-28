import useHomeApi from "../../hooks/useHomeApi";
import classes from './UserProfile.module.css';
import { getDownloadURL, storage, ref } from '../../services/firebase';

const UserProfile = () => {
    const { putUser, postUserAvatar } = useHomeApi();
    const userData = {};
    const encodedImage = {};


    const changeUserName = (e) => {
        if (e.target.value && e.target.value !== '') {
            userData.name = e.target.value;
        }

    }

    const changeUserAvatar = (e) => {
        if (e.target.files[0]) {
            encodeImageFileAsURL(e);
        }
    }
    const encodeImageFileAsURL = (element) => {
        const file = element.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            encodedImage.name = encodeURIComponent(element.target.files[0].name);
            trasformString(reader.result);
        }
    }

    const trasformString = (string) => {
        const codeValue = string.split("base64,")[1];
        encodedImage.code = codeValue
    }

    const updateUser = (e) => {
        e.preventDefault();
        if (encodedImage.code) {
            postUserAvatar(encodedImage.code, encodedImage.name)
                .then(((e) => {
                    getDownloadURL(ref(storage, e.path))
                        .then((e) => {
                            console.log(e);
                            userData.avatar = e;
                            putUser(JSON.stringify(userData));
                        })
                }));
        } else if (userData.name) {
            putUser(JSON.stringify(userData));
        } else {
            return;
        }
    }

    return (
        <div className={classes.container}>
            <form onSubmit={updateUser} className={classes.form}>
            <h1>Изменение данных пользователя</h1>
                <div className={classes.control}>
                    <label>Введите имя пользователя</label>
                    <input type="text" onChange={changeUserName} />
                </div>
                <div className={classes.control}>
                    <label>Выберите файл аватара</label>
                    <input type="file" onChange={changeUserAvatar} />
                </div>
                <div className={classes.actions}>
                    <button className={classes.submit}>Подтвердить</button>
                </div>
            </form>
        </div>
    )
}

export default UserProfile;
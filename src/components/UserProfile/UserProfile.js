import useHomeApi from "../../hooks/useHomeApi";
import classes from "./UserProfile.module.css";
import { useState, useRef } from "react";
import { getDownloadURL, storage, ref } from "../../services/firebase";
import Spinner from "../Spinner/Spinner";

const IMAGE_ERRORS = {
  WRONG_TYPE:
    "Расширение выбранного файла должно быть 'jpeg', 'bmp', 'png' или 'gif'",
  WRONG_SIZE: "Размер выбранного файла должен быть не более 1 Mbyte",
};

const UserProfile = () => {
  const { putUser, postUserAvatar } = useHomeApi();
  const [imageError, setImageError] = useState();
  const [isProfileUpdated, setIsProfileUpdate] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [encodedImageName, setEncodedImageName] = useState();
  const [encodedImageCode, setEncodedImageCode] = useState();
  const [name, setName] = useState();
  const [avatar, setAvatar] = useState();
  const inputFileValue = useRef();
  const [isSelected, setIsSelected] = useState();

  const changeUserName = (e) => {
    if (e.target.value && e.target.value !== "") {
      setName(e.target.value);
      setIsProfileUpdate(false);
      setError(false);
    }
  };

  const changeUserAvatar = (e) => {
    if (e.target.files[0]) {
      setError(false);
      setIsProfileUpdate(false);
      setImageError();
      encodeImageFileAsURL(e);
    }
  };

  const encodeImageFileAsURL = (element) => {
    setAvatar(undefined);
    const file = element.target.files[0];
    const fileSize = element.target.files[0].size;
    const fileType = element.target.files[0].type.split("/")[1];

    if (fileSize > 1024001) {
      setImageError(IMAGE_ERRORS.WRONG_SIZE);
      return;
    }

    if (!["jpeg", "bmp", "png", "gif"].includes(fileType)) {
      setImageError(IMAGE_ERRORS.WRONG_TYPE);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setEncodedImageName(encodeURIComponent(element.target.files[0].name));
      trasformString(reader.result);
      setAvatar(reader.result);
    };
  };

  const trasformString = (string) => {
    const codeValue = string.split("base64,")[1];
    setEncodedImageCode(codeValue);
  };

  const updateUser = async () => {
    try {
      if (encodedImageCode) {
        setLoading(true);
        const response = await postUserAvatar(
          encodedImageCode,
          encodedImageName
        );
        const avatar = await getDownloadURL(ref(storage, response.path));
        await putUser(JSON.stringify({ name, avatar }));
        setIsProfileUpdate(true);
      } else if (name) {
        setLoading(true);
        await putUser(JSON.stringify({ name }));
        setIsProfileUpdate(true);
        setError(false);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setAvatar(false);
    }
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!name && !encodedImageName) {
      setError(true);
      return;
    }
    if (imageError) {
      return;
    }
    updateUser();
  };

  const resetAvatar = () => {
    setAvatar(undefined);
    inputFileValue.current.value = "";
    toggleSelect();
  };

  const toggleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className={classes.container}>
      <form onSubmit={validateAndSubmit} className={classes.form}>
        <h1>Изменение данных пользователя</h1>
        <div className={classes.control}>
          <label>Введите имя пользователя</label>
          <input type="text" onChange={changeUserName} />
        </div>
        <div className={classes.control}>
          <label>Выберите файл аватара</label>
          {avatar && (
            <div
              className={classes.circle}
              style={{
                backgroundImage: `url(${avatar})`,
                color: isSelected && "#aa0b20",
              }}
            >
              <div
                onClick={resetAvatar}
                className={classes.reset}
                onMouseOver={toggleSelect}
                onMouseOut={toggleSelect}
              >
                X
              </div>
            </div>
          )}
          <input type="file" onChange={changeUserAvatar} ref={inputFileValue} />
          {imageError && <div style={{ color: "#a70000" }}>{imageError}</div>}
          {error && !imageError && (
            <div style={{ color: "#a70000" }}>Введите данные</div>
          )}
        </div>
        <div className={classes.actions}>
          {loading && <Spinner width="100px" height="100px" />}
          {!isProfileUpdated && !loading && (
            <button className={classes.submit}>Подтвердить</button>
          )}
        </div>
        {isProfileUpdated && (
          <div style={{ color: "green", fontWeight: "bold", fontSize: "22px" }}>
            Внесенные данные успешно изменены
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;

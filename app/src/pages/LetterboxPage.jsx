import { Button, ButtonSize } from "components/button/Button";
import Loader from "components/loader/Loader";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import _ from "lodash";
import { useGetOneData, usePutData } from "queryHooks/useLetterbox";
import { useGetOneData as getProperty } from "queryHooks/useProperty";
import { useEffect, useRef, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmark, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { deepClone } from "utils/functions.utils";

export const LetterboxPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [content, setContent] = useState([]);
    const [columns, setColumns] = useState(4);

    const { data, isLoading, error, isSuccess } = useGetOneData(id);
    const {
        data: property,
        isLoading: isLoadingProperty,
        isSuccess: isSuccessProperty,
    } = getProperty(data ? data.property.id : false);

    const { mutate, isLoading: isPutPending } = usePutData();

    const handleAddCard = () => {
        let _content = [
            ...content,
            { isHidden: false, isBorder: false, name: "", other: "" },
        ];
        setContent(_content);
    };

    useEffect(() => {
        if (isSuccess) {
            setContent(data.content);
            setColumns(data.columns);
        }
    }, [data, isSuccess]);

    console.log("isSuccess", isSuccess);

    // useEffect(() => {
    //     if (inputRefs.current.length > 0) {
    //         inputRefs.current[inputRefs.current.length - 1].focus();
    //     }
    // }, [content]);

    const inputRefs = useRef([]); // Ref to store input refs

    const handleContent = (e, id) => {
        const _content = deepClone(content);
        _content[id][e.target.name] = e.target.value;
        setContent(_content);
    };

    const handleToggle = (e, id) => {
        const _content = deepClone(content);
        _content[id][e.target.name] = e.target.checked;
        setContent(_content);
    };

    const handleSelectEntrance = (id) => {
        navigate("/letterboxes/" + id);
    };

    if (isLoading || isLoadingProperty) return <Loader />;
    else
        return (
            <>
                <Header
                    title="Tableau BAL"
                    isLoading={isLoading}
                    error={error}
                    subtitle={data.property.title}
                >
                    <div className="mr-5 flex flew-row gap-3 items-center">
                        <Button
                            size={ButtonSize.small}
                            onClick={() =>
                                setColumns(columns !== 1 ? columns - 1 : 1)
                            }
                        >
                            <span className="mb-1">-</span>
                        </Button>
                        <div className="w-24 text-center">
                            {columns} {columns === 1 ? "rangée" : "rangées"}
                        </div>
                        <Button
                            size={ButtonSize.small}
                            onClick={() => setColumns(columns + 1)}
                        >
                            +
                        </Button>
                    </div>
                    {property.entrances.length !== 0 && (
                        <select
                            name="lettexbox"
                            id="letterbox"
                            onChange={(e) =>
                                handleSelectEntrance(e.target.value)
                            }
                            defaultValue={id}
                        >
                            {property.letterboxes.map((letterbox) => (
                                <option
                                    key={letterbox["@id"]}
                                    value={letterbox.id}
                                >
                                    Entrée - {letterbox.entrance}
                                </option>
                            ))}
                        </select>
                    )}
                    <Button
                        size={ButtonSize.Big}
                        onClick={() =>
                            mutate({
                                id: data.id,
                                content: content,
                                columns: columns,
                            })
                        }
                        disabled={
                            isPutPending ||
                            (_.isEqual(data.content, content) &&
                                data.columns === columns)
                        }
                    >
                        {isPutPending ? (
                            <span className="loading loading-spinner loading-sm text-accent"></span>
                        ) : (
                            <IoMdCheckmark
                                className={`${
                                    isPutPending ||
                                    (_.isEqual(data.content, content) &&
                                        data.columns === columns)
                                        ? "text-neutral"
                                        : "text-white"
                                }`}
                            />
                        )}
                    </Button>
                    <Button
                        size={ButtonSize.Big}
                        onClick={() => navigate("/properties/" + property.id)}
                    >
                        <MdArrowBack />
                    </Button>
                </Header>
                <Content>
                    <div
                        className="dark:bg-gradient-page scrollbar overflow-x-auto overflow-y-hidden p-5 rounded"
                        style={{ maxWidth: "calc(100vw - 270px)" }}
                    >
                        <div
                            className="grid gap-3 mx-auto"
                            style={{
                                width: `${columns * 280}px`,
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                            }}
                        >
                            {content.map((contentItem, id) => {
                                return (
                                    <Card
                                        key={id}
                                        contentItem={contentItem}
                                        id={id}
                                        handleContent={handleContent}
                                        handleToggle={handleToggle}
                                        inputRef={(el) =>
                                            (inputRefs.current[id] = el)
                                        }
                                    />
                                );
                            })}

                            <AddCard handleAddCard={handleAddCard} />
                        </div>
                    </div>
                </Content>
            </>
        );
};

const Card = ({ contentItem, id, handleContent, handleToggle, inputRef }) => {
    return (
        <div
            className={`_card flex flex-col justify-between items-center !p-2 border " ${
                contentItem.isBorder && !contentItem.isHidden
                    ? "border-error"
                    : "border-dark"
            }`}
        >
            {!contentItem.isHidden ? (
                <div className="mb-3">
                    <textarea
                        ref={inputRef}
                        name="name"
                        placeholder="Nom ..."
                        value={contentItem.name}
                        onChange={(e) => handleContent(e, id)}
                    />
                    <textarea
                        name="other"
                        placeholder="Autre ..."
                        value={contentItem.other}
                        onChange={(e) => handleContent(e, id)}
                    />
                </div>
            ) : (
                <div className="mb-3 bg-white/5 w-full rounded-sm h-[133px]"></div>
            )}
            <div className="flex gap-3">
                <label className="btn btn-sm btn-secondary border-0 btn-circle swap swap-rotate">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        name="isHidden"
                        checked={contentItem.isHidden}
                        onChange={(e) => handleToggle(e, id)}
                    />

                    {/* hamburger icon */}
                    <svg
                        className="swap-off fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 512 512"
                    >
                        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                    </svg>

                    {/* close icon */}
                    <svg
                        className="swap-on fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 512 512"
                    >
                        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                    </svg>
                </label>
                <label className="btn btn-sm btn-secondary border-0 btn-circle !swap !swap-rotate">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        name="isBorder"
                        checked={contentItem.isBorder}
                        onChange={(e) => handleToggle(e, id)}
                    />

                    <IoCheckmark className="swap-off fill-current" size={20} />
                    <IoEllipsisHorizontalSharp
                        className="swap-on fill-current"
                        size={20}
                    />
                </label>
            </div>
        </div>
    );
};

const AddCard = ({ handleAddCard }) => {
    return (
        <button className="btn btn-primary" onClick={() => handleAddCard()}>
            Ajouter une étiquette
        </button>
    );
};

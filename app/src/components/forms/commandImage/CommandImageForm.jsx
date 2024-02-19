import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_MEDIAS, IRI } from "../../../config/api.config";

import "./style.css";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

import FilePondPluginFileRename from "filepond-plugin-file-rename";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

// Register the plugins
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileRename,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

export const CommandImageForm = ({ commandID, handleCloseModal }) => {
    const [files, setFiles] = useState([]);
    const queryClient = useQueryClient();

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
        >
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                allowRevert={false}
                fileRenameFunction={(file) => {
                    return `command-${commandID}${file.extension}`;
                }}
                imageResizeTargetWidth={600}
                maxFiles={10}
                name="file"
                chunkUploads={true}
                label
                labelIdle={
                    '<div class="filepond--label-action"><svg stroke-width="0" viewBox="0 0 1024 1024" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg></div>'
                }
                server={{
                    url: IRI + API_MEDIAS,
                    timeout: 7000,
                    process: {
                        withCredentials: false,
                        onload: (response) => response.key,
                        onerror: (response) => response.data,
                        ondata: (formData) => {
                            formData.append("command", commandID);
                            return formData;
                        },
                    },
                    // revert: './revert',
                    // restore: './restore/',
                    // load: './load/',
                    // fetch: './fetch/',
                }}
                onprocessfiles={() => {
                    queryClient.invalidateQueries();
                }}
            />
        </div>
    );
};

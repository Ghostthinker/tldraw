import {SpeedDial} from 'primereact/speeddial';
import React from "react";
import styled from "styled-components";
import {Tooltip} from "primereact/tooltip";

const ADD_FROM_EDUBREAK = 'add_from_edubreak';
const UPLOAD_CONTENT = 'upload_content';
const CREATE_SCREEN_RECORDING = 'create_screen_recording';
const IMPORT_MEDIA = 'import_media';
const SHARE_BOARD = 'share_board';

function handleSpeedDialClick(action: string) {
  // TODO: hier button actions einfuegen
  switch (action) {
    case ADD_FROM_EDUBREAK: console.log('edubreak'); break;
    case UPLOAD_CONTENT: console.log('upload'); break;
    case CREATE_SCREEN_RECORDING: console.log('screen recording'); break;
    case IMPORT_MEDIA: console.log('import'); break;
    case SHARE_BOARD: console.log('share'); break;
  }
}

const dialItems = [
  {
    label: 'Add content from edubreak',
    items: [{
      label: 'New', icon: 'pi pi-fw pi-plus', command: () => {
        handleSpeedDialClick(ADD_FROM_EDUBREAK)
      }
    }]
  },
  {
    label: 'Upload content',
    items: [{
      label: 'New', icon: 'pi pi-fw pi-plus', command: () => {
        handleSpeedDialClick(UPLOAD_CONTENT)
      }
    }]
  },
  {
    label: 'Create screen recording',
    items: [{
      label: 'New', icon: 'pi pi-fw pi-plus', command: () => {
        handleSpeedDialClick()
      }
    }]
  },
  {
    label: 'Import media',
    items: [{
      label: 'New', icon: 'pi pi-fw pi-plus', command: () => {
        handleSpeedDialClick()
      }
    }]
  },
  {
    label: 'Share board',
    items: [{
      label: 'New', icon: 'pi pi-fw pi-plus', command: () => {
        handleSpeedDialClick('share_board')
      }
    }]
  }
]

const StyledSpeedDial = styled(SpeedDial)`
  position: fixed;
  bottom: 10px;
  right: 10px;

  .p-button {
    background-color: #023047;
    border: 1px solid #023047;
  }

  .p-button:hover {
    background-color: rgb(3, 69, 105);
    border: 1px solid rgb(3, 69, 105);
  }
`;

const SVBSpeedDial = () => {
  return (
    <>
      <Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left"/>
      <StyledSpeedDial model={dialItems} direction="up" className="speeddial-bottom-right right-0 bottom-0"/>
    </>
  );
};

export default SVBSpeedDial;

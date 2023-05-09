import {SpeedDial} from 'primereact/speeddial';
import React from "react";
import styled from "styled-components";
import {Tooltip} from "primereact/tooltip";
import {PrimeIcons} from "primereact/api";

const ADD_FROM_EDUBREAK = 'add_from_edubreak';
const UPLOAD_CONTENT = 'upload_content';
const CREATE_SCREEN_RECORDING = 'create_screen_recording';
const IMPORT_MEDIA = 'import_media';
const SHARE_BOARD = 'share_board';

function handleSpeedDialClick(action: string) {
  // TODO: hier button actions einfuegen
  switch (action) {
    case ADD_FROM_EDUBREAK:
      console.log('edubreak');
      break;
    case UPLOAD_CONTENT:
      console.log('upload');
      break;
    case CREATE_SCREEN_RECORDING:
      console.log('screen recording');
      break;
    case IMPORT_MEDIA:
      console.log('import');
      break;
    case SHARE_BOARD:
      console.log('share');
      break;
  }
}

const dialItems = [
  {
    label: 'Add content from edubreak',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
      '<path className={'eb-icon-out'} d="M12.2917 0.132217C12.8583 -0.182711 13.4974 0.0727725 13.5 0.815192V10.2112C13.5 11.1977 13.2602 11.6568 12.5012 12.1273L2.15188 17.8618C1.58263 18.1767 0.90269 17.9516 0.900055 17.2066V7.81063C0.897419 7.06821 1.06477 6.35615 1.89888 5.89451L12.2917 0.132217Z" fill="white"/>\n' +
      '<path className={'eb-icon-out'} d="M15.9696 2.76744L13.5 3.66986V10.8L16.0299 9.88642C16.6245 9.67321 17.1 9.30505 17.1 8.55138V3.4269C17.1 2.86165 16.563 2.55547 15.9684 2.76744" fill="white"/>\n' +
      '<path className={'eb-icon-in'} d="M13.5 3.60001L4.75137 6.59504C4.11007 6.81407 3.59455 7.42785 3.60008 7.96777V13.3313C3.60423 13.87 4.17641 14.1298 4.81771 13.9107L5.67875 13.6153V15.3L7.8749 12.864L13.4987 10.9373V3.60001H13.5Z" fill="#023047"/>\n' +
      '</svg>,
    command: () => {
      handleSpeedDialClick(ADD_FROM_EDUBREAK)
    }
  },
  {
    label: 'Upload content',
    icon: PrimeIcons.CLOUD_UPLOAD,
    command: () => {
      handleSpeedDialClick(UPLOAD_CONTENT)
    }
  },
  {
    label: 'Create screen recording',
    icon: PrimeIcons.VIDEO,
    command: () => {
      handleSpeedDialClick(CREATE_SCREEN_RECORDING)
    }
  },
  {
    label: 'Import media',
    icon: 'pi pi-file-import',
    command: () => {
      handleSpeedDialClick(IMPORT_MEDIA)
    }
  },
  {
    label: 'Share board',
    icon: PrimeIcons.SHARE_ALT,
    command: () => {
      handleSpeedDialClick(SHARE_BOARD)
    }
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

  .p-speeddial-action {
    background: transparent;
    border: 3px solid #023047;
  }

  .p-speeddial-action:hover {
    background: #023047;

    .pi {
      color: white;
    }

    .eb-icon-out {
      fill: white;
    }

    .eb-icon-in {
      fill: #023047;
    }
  }

  .pi {
    color: #023047;
  }

  .eb-icon-out {
    fill: #023047;
  }

  .eb-icon-in {
    fill: white;
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

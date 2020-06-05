import React, { useState, useEffect } from 'react';
import BacklogList from './BacklogList/BacklogList';
import AddUserstoryForm from '../AddUserstoryForm/AddUserstoryForm';
import { getStory, createStory, deleteStory, updateStory } from '../../api_services/userstory.service';
import { backlogId, sprintlogId } from '../../api_services/config';
import { getList, getLists } from '../../api_services/scrumlist.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import './BacklogView.css';

const BacklogView = () => {
    const [backlogList, setBacklogList] = useState([]);
    const [sprintlogList, setSprintlogList] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [btnText, setBtnText] = useState('Add new userstory');

    //helper function for fetching stories from database and re-rendering the component
    const fetchLists = async () => {
        const _backlogList = await getList(backlogId);
        const _sprintlogList = await getList(sprintlogId);
        //sort the lists!!
        setBacklogList(_backlogList.stories);
        setSprintlogList(_sprintlogList.stories);
    }

    //event callback function for creating new userstories
    const onStoryCreate = async (listId, storyInput) => {
        //create new story and save it to db with API post request
        await createStory(listId, storyInput);
        //fetch updated information from db and re-render the lists
        fetchLists();
    }
    const onStoryDelete = async (storyId) => {
        await deleteStory(storyId);
        fetchLists();
    }
    const onStoryUpdate = async (storyId) => {
        console.log('this story will be edited: ', storyId);
    }

    const showUserstoryForm = () => {
        if (!isVisible) {
            setIsVisible(true);
            setBtnText('Hide form');
        }
        if (isVisible) {
            setIsVisible(false);
            setBtnText('Add new userstory');
        }

    }

    //fetching all of the stories from back-end
    useEffect(() => {
        getLists()
            .then(lists => console.log(lists));

        //sort the lists!!
        getList(backlogId)
            .then(list => {
                console.log(list.title)
                setBacklogList(list.stories)
            })
            .catch((error) => {
                console.log(new Error(error))
            })
        getList(sprintlogId)
            .then(list => {
                console.log(list.title)
                setSprintlogList(list.stories)
            })
            .catch((error) => {
                console.log(new Error(error))
            })
    }, []);

    return (
        <div className="backlogview-container">
            <div className='backloglist-wrapper'>
                <div className='backloglist__header-wrapper'>
                    <FontAwesomeIcon icon={faEllipsisH} />
                    <h1 className='backloglist__header'>Product Backlog</h1>
                    <button className='add-userstory-btn' onClick={showUserstoryForm} >{btnText}</button>
                </div>

                <AddUserstoryForm onStoryCreate={onStoryCreate} isVisible={isVisible} listId={backlogId} />
                <BacklogList userstoryList={backlogList} title='Product Backlog' onStoryDelete={onStoryDelete} onStoryUpdate={onStoryUpdate} />
            </div>
            <div className='backloglist-wrapper'>
                <h1 className='backloglist__header' >Sprint Backlog</h1>
                <BacklogList userstoryList={sprintlogList} title='Sprint Backlog' onStoryDelete={onStoryDelete} onStoryUpdate={onStoryUpdate} />
            </div>

        </div>
    );
}

export default BacklogView;

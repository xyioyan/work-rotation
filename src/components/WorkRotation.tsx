import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WorkRotation.css";

const workers = ["Ravi", "Ravi", "Selvam", "Selvam", "Karuppasamy", "Karuppasamy"];
const rotationDays = 1;

// Generate initial work list
const generateWorkList = (workers) => {
    return workers.map(worker => ({ name: worker, status: "willWork" }));
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
    // return (new Date("2025-03-01").toISOString().split("T")[0])
};

// Retrieve start date from localStorage or default to 20-Feb-2025
const getStoredStartDate = () => {
    const dateString = "2025-02-21";
    return new Date(dateString);
};

const diffDays = Math.floor(
    (new Date(getTodayDate()).getTime() - new Date(getStoredStartDate).getTime()) / (1000 * 60 * 60 * 24)
);

const WorkRotation = () => {
    const [workSchedule, setWorkSchedule] = useState(generateWorkList(workers));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startDate, setStartDate] = useState(getStoredStartDate()); // Start date state

    // Calculate how many days have passed since startDate
    useEffect(() => {
        const today = new Date(getTodayDate());
        const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        let newIndex = (diffDays * rotationDays) % workSchedule.length;
        setCurrentIndex(newIndex);

        // If the schedule is completed, update the start date
        if (newIndex === 0 && diffDays > 0) {
            const nextStartDate = new Date(today);
            nextStartDate.setDate(nextStartDate.getDate() ); // Next cycle starts the next day

            setStartDate(nextStartDate);
        }
    }, [workSchedule.length, startDate]);

    // Update worker statuses whenever the index changes
    useEffect(() => {
        setWorkSchedule((prevSchedule) => {
            return prevSchedule.map((worker, index) => ({
                ...worker,
                status:
                    index < currentIndex ? "worked"
                        : index < currentIndex + rotationDays ? "working"
                            : "willWork"
            }));
        });
    }, [currentIndex]);
    const onDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside, do nothing
    
        const items = Array.from(workSchedule);
        const [reorderedItem] = items.splice(result.source.index, 1);
    
        // Prevent dragging into the "worked" section
        if (workSchedule[result.destination.index]?.status === "worked") return;
    
        // Allow dragging only if status is "willWork" or "working"
        if (reorderedItem.status !== "willWork" && reorderedItem.status !== "working") return;
    
        // If a "working" worker is moved, change it back to "willWork"
        if (reorderedItem.status === "working") {
            reorderedItem.status = "willWork";
        }
    
        items.splice(result.destination.index, 0, reorderedItem);
    
        // Find the last "worked" index
        const lastWorkedIndex = items.findLastIndex(worker => worker.status === "worked");
        console.log("lastIndex"+lastWorkedIndex);
    
        // Ensure only the first "willWork" after "worked" becomes "working"
        let firstWillWorkFound = false;
        items.forEach((worker, index) => {
            if (index === lastWorkedIndex + 1 && worker.status === "willWork" && !firstWillWorkFound) {
                worker.status = "working";
                firstWillWorkFound = true;
            } else if (index > lastWorkedIndex + 1) {
                worker.status = "willWork";
            }
        });
    
        setWorkSchedule(items);
    };
    
    

    return (
        <div className="container">
            <h2>Work Rotation</h2>
            <p>Start Date: {startDate.toISOString().split("T")[0]}</p>
            <p>Current Worker Index: {currentIndex}</p>
            <p>Days past since the Turn start: {(diffDays+1)%workSchedule.length}</p>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workList">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="list">
                            {workSchedule.map((worker, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={worker.name + index}
                                    index={index}
                                    isDragDisabled={worker.status !== "willWork" && worker.status !== "working" }
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`box ${worker.status}`}
                                        >
                                            {worker.name}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default WorkRotation;

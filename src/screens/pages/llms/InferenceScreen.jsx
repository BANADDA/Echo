const InferenceScreen = ({ model }) => {
    if (!model) return <div>No model selected</div>;

    return (
        <div className="flex flex-col ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
            <h1 className="text-xl font-bold mb-4">Inference for {model.modelName}</h1>
            <div>
                <p>Model ID: {model.modelId}</p>
                <p>Model Name: {model.modelName}</p>
                <p>Deployed At: {new Date(model.deployedAt.seconds * 1000).toLocaleString()}</p>
                <p>Description: {model.description || 'No description available'}</p>
                <p>Tags: {model.tags || 'No tags'}</p>
                <p>Upvotes: {model.upvotes || 0}</p>
                <a href={model.serverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Server URL</a>
            </div>
            {/* Add your inference logic here */}
        </div>
    );
};

export default InferenceScreen;

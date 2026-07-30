export function createFormComponent() {
  return `
    <form id="create-form" class="max-w-sm mx-auto">
      <!-- title -->
      <div class="mb-5">
        <label
          for="title"
          class="block mb-2.5 text-sm font-medium text-heading"
        >Title</label>
        <input
          type="text"
          id="title"
          class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="enter title"
          required
        />
      </div>
      <!-- price -->
      <div class="mb-5">
        <label
          for="price"
          class="block mb-2.5 text-sm font-medium text-heading"
        >Price</label>
        <input
          type="number"
          id="price"
          class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="enter price"
          required
        />
      </div>
  
      <!-- description -->
      <div class="mb-5">
        <label
          for="description"
          class="block mb-2.5 text-sm font-medium text-heading"
        >Description</label>
        <textarea
          id="description"
          class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="enter description"
          required
        ></textarea>
      </div>
  
      <!-- categoryID -->
      <div class="mb-5">
        <label
          for="categoryId"
          class="block mb-2.5 text-sm font-medium text-heading"
        >Category ID</label>
        <input
          type="number"
          id="categoryId"
          class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="enter category ID"
          required
        />
      </div>
  
      <!-- images -->
      <div class="mb-5">
        <label
          for="image"
          class="block mb-2.5 text-sm font-medium text-heading"
        >Image</label>
        <input
          type="url"
          id="image"
          class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="image"
          required
        />
      </div>
      <!-- submit button -->
      <button
        type="submit"
        class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
      >
        Submit
      </button>
    </form>`;
}

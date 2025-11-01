const express = require('express');
const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/reports/generate/:productId
// @desc    Generate PDF report for product
// @access  Private
router.post('/generate/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('user', 'name company');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    if (product.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="product-report.pdf"');
      res.send(pdfData);
    });

    // Add content to PDF
    doc.fontSize(20).text('Product Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Product Name: ${product.name}`);
    doc.text(`Description: ${product.description}`);
    doc.text(`Category: ${product.category}`);
    doc.text(`Price: $${product.price}`);
    doc.text(`Company: ${product.user.company}`);
    doc.text(`User: ${product.user.name}`);
    doc.moveDown();

    if (product.questions && product.questions.length > 0) {
      doc.fontSize(16).text('Additional Questions:');
      product.questions.forEach((q, index) => {
        doc.fontSize(12).text(`${index + 1}. ${q.questionId ? q.questionId.text : 'Question'}: ${q.answer || 'Not answered'}`);
      });
    }

    doc.end();

    // Save report to DB
    const report = new Report({
      product: product._id,
      user: req.user.id,
      data: {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        questions: product.questions,
      },
    });
    await report.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/reports
// @desc    Get all reports for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).populate('product', 'name');
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
